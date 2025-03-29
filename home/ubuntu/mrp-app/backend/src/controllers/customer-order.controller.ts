import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { CustomerOrder } from "../models/customer-order.model";
import { CustomerOrderItem } from "../models/customer-order-item.model";
import { Customer } from "../models/customer.model";
import { Item } from "../models/item.model";
import { UnitOfMeasurement } from "../models/unit-of-measurement.model";
import { ManufacturingOrder } from "../models/manufacturing-order.model";

export class CustomerOrderController {
  // Get all customer orders
  static async getAllOrders(req: Request, res: Response) {
    try {
      const { division_id, customer_id, status } = req.query;
      
      const orderRepository = AppDataSource.getRepository(CustomerOrder);
      let queryBuilder = orderRepository.createQueryBuilder("order")
        .leftJoinAndSelect("order.division", "division")
        .leftJoinAndSelect("order.customer", "customer")
        .leftJoinAndSelect("order.created_by_user", "created_by");
      
      // Filter by division if provided
      if (division_id) {
        queryBuilder = queryBuilder.where("order.division_id = :division_id", { division_id });
      }
      
      // Filter by customer if provided
      if (customer_id) {
        const condition = division_id ? "AND" : "WHERE";
        queryBuilder = queryBuilder.andWhere(`order.customer_id = :customer_id`, { customer_id });
      }
      
      // Filter by status if provided
      if (status) {
        const condition = (division_id || customer_id) ? "AND" : "WHERE";
        queryBuilder = queryBuilder.andWhere(`order.status = :status`, { status });
      }
      
      // Order by creation date descending
      queryBuilder = queryBuilder.orderBy("order.created_at", "DESC");
      
      const orders = await queryBuilder.getMany();

      return res.status(200).json(orders);
    } catch (error) {
      console.error("Error in getAllOrders:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Get customer order by ID
  static async getOrderById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const orderRepository = AppDataSource.getRepository(CustomerOrder);
      const order = await orderRepository.findOne({
        where: { id: parseInt(id) },
        relations: ["division", "customer", "created_by_user"]
      });

      if (!order) {
        return res.status(404).json({ message: "Customer order not found" });
      }

      // Get order items
      const orderItemRepository = AppDataSource.getRepository(CustomerOrderItem);
      const items = await orderItemRepository.find({
        where: { customer_order_id: parseInt(id) },
        relations: ["item", "uom"],
        order: { id: "ASC" }
      });

      // Return order with items
      return res.status(200).json({
        ...order,
        items
      });
    } catch (error) {
      console.error("Error in getOrderById:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Create a new customer order
  static async createOrder(req: Request, res: Response) {
    try {
      const { 
        division_id, 
        customer_id, 
        order_date,
        required_date,
        shipping_address,
        billing_address,
        currency,
        notes,
        items
      } = req.body;

      // Validate required fields
      if (!division_id || !customer_id || !order_date || !required_date || !items || !items.length) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Validate customer
      const customerRepository = AppDataSource.getRepository(Customer);
      const customer = await customerRepository.findOne({ where: { id: customer_id } });
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }

      // Start transaction
      const queryRunner = AppDataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        // Generate order number
        const orderNumber = `SO-${Date.now().toString().slice(-6)}`;

        // Create new order
        const order = new CustomerOrder();
        order.division_id = division_id;
        order.customer_id = customer_id;
        order.order_number = orderNumber;
        order.order_date = new Date(order_date);
        order.required_date = new Date(required_date);
        order.status = "draft";
        order.payment_status = "pending";
        order.shipping_address = shipping_address || customer.address;
        order.billing_address = billing_address || customer.address;
        order.currency = currency || "USD";
        order.notes = notes || null;
        order.created_by = (req as any).user.id; // Assuming user ID is set by auth middleware
        order.total_amount = 0; // Will be calculated from items

        const savedOrder = await queryRunner.manager.save(order);

        // Process items
        let totalAmount = 0;
        for (const itemData of items) {
          // Validate item
          const itemRepository = AppDataSource.getRepository(Item);
          const item = await itemRepository.findOne({ where: { id: itemData.item_id } });
          if (!item) {
            throw new Error(`Item with ID ${itemData.item_id} not found`);
          }

          // Validate UOM
          const uomRepository = AppDataSource.getRepository(UnitOfMeasurement);
          const uom = await uomRepository.findOne({ where: { id: itemData.uom_id } });
          if (!uom) {
            throw new Error(`Unit of measurement with ID ${itemData.uom_id} not found`);
          }

          // Calculate total price
          const unitPrice = itemData.unit_price;
          const quantity = itemData.quantity;
          const discount = itemData.discount || 0;
          const tax = itemData.tax || 0;
          
          const discountAmount = (unitPrice * quantity) * (discount / 100);
          const subtotal = (unitPrice * quantity) - discountAmount;
          const taxAmount = subtotal * (tax / 100);
          const totalPrice = subtotal + taxAmount;
          
          totalAmount += totalPrice;

          // Create order item
          const orderItem = new CustomerOrderItem();
          orderItem.customer_order_id = savedOrder.id;
          orderItem.item_id = itemData.item_id;
          orderItem.quantity = quantity;
          orderItem.uom_id = itemData.uom_id;
          orderItem.unit_price = unitPrice;
          orderItem.discount = discount;
          orderItem.tax = tax;
          orderItem.total_price = totalPrice;
          orderItem.status = "pending";
          orderItem.required_date = new Date(itemData.required_date || required_date);

          await queryRunner.manager.save(orderItem);
        }

        // Update order total
        savedOrder.total_amount = totalAmount;
        await queryRunner.manager.save(savedOrder);

        // Commit transaction
        await queryRunner.commitTransaction();

        // Get complete order with items
        return this.getOrderById({ params: { id: savedOrder.id.toString() } } as Request, res);
        
      } catch (error) {
        // Rollback transaction on error
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        // Release query runner
        await queryRunner.release();
      }
    } catch (error) {
      console.error("Error in createOrder:", error);
      return res.status(500).json({ message: error.message || "Internal server error" });
    }
  }

  // Update customer order
  static async updateOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { 
        required_date,
        shipping_address,
        billing_address,
        notes,
        status,
        payment_status
      } = req.body;

      const orderRepository = AppDataSource.getRepository(CustomerOrder);
      const order = await orderRepository.findOne({ where: { id: parseInt(id) } });

      if (!order) {
        return res.status(404).json({ message: "Customer order not found" });
      }

      // Check if order can be updated
      if (["completed", "cancelled"].includes(order.status)) {
        return res.status(400).json({ message: "Cannot update completed or cancelled orders" });
      }

      // Update order fields
      if (required_date) order.required_date = new Date(required_date);
      if (shipping_address !== undefined) order.shipping_address = shipping_address;
      if (billing_address !== undefined) order.billing_address = billing_address;
      if (notes !== undefined) order.notes = notes;
      if (status) order.status = status;
      if (payment_status) order.payment_status = payment_status;

      await orderRepository.save(order);

      // Get updated order with items
      return this.getOrderById(req, res);
    } catch (error) {
      console.error("Error in updateOrder:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Delete customer order
  static async deleteOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Start transaction
      const queryRunner = AppDataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        // Delete order items first
        const orderItemRepository = AppDataSource.getRepository(CustomerOrderItem);
        await orderItemRepository.delete({ customer_order_id: parseInt(id) });

        // Delete order
        const orderRepository = AppDataSource.getRepository(CustomerOrder);
        const order = await orderRepository.findOne({ where: { id: parseInt(id) } });

        if (!order) {
          return res.status(404).json({ message: "Customer order not found" });
        }

        // Check if order can be deleted
        if (!["draft", "cancelled"].includes(order.status)) {
          return res.status(400).json({ message: "Only draft or cancelled orders can be deleted" });
        }

        await orderRepository.remove(order);

        // Commit transaction
        await queryRunner.commitTransaction();

        return res.status(200).json({ message: "Customer order deleted successfully" });
      } catch (error) {
        // Rollback transaction on error
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        // Release query runner
        await queryRunner.release();
      }
    } catch (error) {
      console.error("Error in deleteOrder:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Create manufacturing orders from customer order
  static async createManufacturingOrders(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Start transaction
      const queryRunner = AppDataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        // Get customer order
        const orderRepository = AppDataSource.getRepository(CustomerOrder);
        const order = await orderRepository.findOne({ 
          where: { id: parseInt(id) },
          relations: ["division"]
        });

        if (!order) {
          return res.status(404).json({ message: "Customer order not found" });
        }

        // Check if order can be processed
        if (!["confirmed"].includes(order.status)) {
          return res.status(400).json({ message: "Only confirmed orders can be processed for production" });
        }

        // Get order items
        const orderItemRepository = AppDataSource.getRepository(CustomerOrderItem);
        const items = await orderItemRepository.find({
          where: { customer_order_id: parseInt(id) },
          relations: ["item"]
        });

        // Create manufacturing orders for each item
        const createdMOs = [];
        for (const item of items) {
          // Skip if item is not a manufactured item
          if (item.item.type !== "finished_good") {
            continue;
          }

          // Create manufacturing order
          const mo = new ManufacturingOrder();
          mo.division_id = order.division_id;
          mo.item_id = item.item_id;
          mo.order_number = `MO-${Date.now().toString().slice(-6)}-${createdMOs.length + 1}`;
          mo.order_type = "make_to_order";
          mo.quantity = item.quantity;
          mo.planned_start_date = new Date(); // Should be calculated based on lead time
          mo.planned_end_date = new Date(order.required_date);
          mo.priority = "medium";
          mo.status = "planned";
          mo.notes = `Created from sales order ${order.order_number}`;
          mo.customer_order_id = order.id;
          mo.customer_order_item_id = item.id;

          const savedMO = await queryRunner.manager.save(mo);
          createdMOs.push(savedMO);

          // Update order item status
          item.status = "allocated";
          await queryRunner.manager.save(item);
        }

        // Update order status if all items are allocated
        const remainingItems = await orderItemRepository.count({
          where: { customer_order_id: parseInt(id), status: "pending" }
        });

        if (remainingItems === 0) {
          order.status = "in_production";
          await queryRunner.manager.save(order);
        }

        // Commit transaction
        await queryRunner.commitTransaction();

        return res.status(200).json({
          message: `Created ${createdMOs.length} manufacturing orders`,
          manufacturing_orders: createdMOs
        });
      } catch (error) {
        // Rollback transaction on error
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        // Release query runner
        await queryRunner.release();
      }
    } catch (error) {
      console.error("Error in createManufacturingOrders:", error);
      return res.status(500).json({ message: error.message || "Internal server error" });
    }
  }

  // Cancel customer order
  static async cancelOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Start transaction
      const queryRunner = AppDataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        // Get customer order
        const orderRepository = AppDataSource.getRepository(CustomerOrder);
        const order = await orderRepository.findOne({ where: { id: parseInt(id) } });

        if (!order) {
          return res.status(404).json({ message: "Customer order not found" });
        }

        // Check if order can be cancelled
        if (["completed", "cancelled"].includes(order.status)) {
          return res.status(400).json({ message: "Cannot cancel completed or already cancelled orders" });
        }

        // Cancel related manufacturing orders
        const moRepository = AppDataSource.getRepository(ManufacturingOrder);
        const relatedMOs = await moRepository.find({
          where: { customer_order_id: parseInt(id) }
        });

        for (const mo of relatedMOs) {
          // Only cancel MOs that are not completed
          if (!["completed"].includes(mo.status)) {
            mo.status = "cancelled";
            await queryRunner.manager.save(mo);
          }
        }

        // Update order items status
        const orderItemRepository = AppDataSource.getRepository(CustomerOrderItem);
        await queryRunner.manager.update(CustomerOrderItem, 
          { customer_order_id: parseInt(id) },
          { status: "cancelled" }
        );

        // Update order status
        order.status = "cancelled";
        await queryRunner.manager.save(order);

        // Commit transaction
        await queryRunner.commitTransaction();

        // Get updated order with it<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>