import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { PurchaseOrder } from "../models/purchase-order.model";
import { PurchaseOrderItem } from "../models/purchase-order-item.model";
import { Supplier } from "../models/supplier.model";
import { Item } from "../models/item.model";
import { UnitOfMeasurement } from "../models/unit-of-measurement.model";

export class PurchaseOrderController {
  // Get all purchase orders
  static async getAllOrders(req: Request, res: Response) {
    try {
      const { division_id, supplier_id, status } = req.query;
      
      const orderRepository = AppDataSource.getRepository(PurchaseOrder);
      let queryBuilder = orderRepository.createQueryBuilder("order")
        .leftJoinAndSelect("order.division", "division")
        .leftJoinAndSelect("order.supplier", "supplier")
        .leftJoinAndSelect("order.created_by_user", "created_by");
      
      // Filter by division if provided
      if (division_id) {
        queryBuilder = queryBuilder.where("order.division_id = :division_id", { division_id });
      }
      
      // Filter by supplier if provided
      if (supplier_id) {
        const condition = division_id ? "AND" : "WHERE";
        queryBuilder = queryBuilder.andWhere(`order.supplier_id = :supplier_id`, { supplier_id });
      }
      
      // Filter by status if provided
      if (status) {
        const condition = (division_id || supplier_id) ? "AND" : "WHERE";
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

  // Get purchase order by ID
  static async getOrderById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const orderRepository = AppDataSource.getRepository(PurchaseOrder);
      const order = await orderRepository.findOne({
        where: { id: parseInt(id) },
        relations: ["division", "supplier", "created_by_user"]
      });

      if (!order) {
        return res.status(404).json({ message: "Purchase order not found" });
      }

      // Get order items
      const orderItemRepository = AppDataSource.getRepository(PurchaseOrderItem);
      const items = await orderItemRepository.find({
        where: { purchase_order_id: parseInt(id) },
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

  // Create a new purchase order
  static async createOrder(req: Request, res: Response) {
    try {
      const { 
        division_id, 
        supplier_id, 
        order_date,
        expected_delivery_date,
        shipping_address,
        currency,
        notes,
        items
      } = req.body;

      // Validate required fields
      if (!division_id || !supplier_id || !order_date || !expected_delivery_date || !items || !items.length) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Validate supplier
      const supplierRepository = AppDataSource.getRepository(Supplier);
      const supplier = await supplierRepository.findOne({ where: { id: supplier_id } });
      if (!supplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }

      // Start transaction
      const queryRunner = AppDataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        // Generate order number
        const orderNumber = `PO-${Date.now().toString().slice(-6)}`;

        // Create new order
        const order = new PurchaseOrder();
        order.division_id = division_id;
        order.supplier_id = supplier_id;
        order.order_number = orderNumber;
        order.order_date = new Date(order_date);
        order.expected_delivery_date = new Date(expected_delivery_date);
        order.status = "draft";
        order.payment_status = "pending";
        order.shipping_address = shipping_address || null;
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
          const orderItem = new PurchaseOrderItem();
          orderItem.purchase_order_id = savedOrder.id;
          orderItem.item_id = itemData.item_id;
          orderItem.quantity = quantity;
          orderItem.uom_id = itemData.uom_id;
          orderItem.unit_price = unitPrice;
          orderItem.discount = discount;
          orderItem.tax = tax;
          orderItem.total_price = totalPrice;
          orderItem.status = "pending";
          orderItem.required_date = new Date(itemData.required_date || expected_delivery_date);

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

  // Update purchase order
  static async updateOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { 
        expected_delivery_date,
        shipping_address,
        notes,
        status,
        payment_status
      } = req.body;

      const orderRepository = AppDataSource.getRepository(PurchaseOrder);
      const order = await orderRepository.findOne({ where: { id: parseInt(id) } });

      if (!order) {
        return res.status(404).json({ message: "Purchase order not found" });
      }

      // Check if order can be updated
      if (["received", "cancelled"].includes(order.status)) {
        return res.status(400).json({ message: "Cannot update received or cancelled orders" });
      }

      // Update order fields
      if (expected_delivery_date) order.expected_delivery_date = new Date(expected_delivery_date);
      if (shipping_address !== undefined) order.shipping_address = shipping_address;
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

  // Delete purchase order
  static async deleteOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Start transaction
      const queryRunner = AppDataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        // Delete order items first
        const orderItemRepository = AppDataSource.getRepository(PurchaseOrderItem);
        await orderItemRepository.delete({ purchase_order_id: parseInt(id) });

        // Delete order
        const orderRepository = AppDataSource.getRepository(PurchaseOrder);
        const order = await orderRepository.findOne({ where: { id: parseInt(id) } });

        if (!order) {
          return res.status(404).json({ message: "Purchase order not found" });
        }

        // Check if order can be deleted
        if (!["draft", "cancelled"].includes(order.status)) {
          return res.status(400).json({ message: "Only draft or cancelled orders can be deleted" });
        }

        await orderRepository.remove(order);

        // Commit transaction
        await queryRunner.commitTransaction();

        return res.status(200).json({ message: "Purchase order deleted successfully" });
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

  // Send purchase order to supplier
  static async sendOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const orderRepository = AppDataSource.getRepository(PurchaseOrder);
      const order = await orderRepository.findOne({ where: { id: parseInt(id) } });

      if (!order) {
        return res.status(404).json({ message: "Purchase order not found" });
      }

      // Check if order can be sent
      if (order.status !== "draft") {
        return res.status(400).json({ message: "Only draft orders can be sent" });
      }

      // Update order status
      order.status = "sent";
      await orderRepository.save(order);

      // Get updated order with items
      return this.getOrderById(req, res);
    } catch (error) {
      console.error("Error in sendOrder:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Cancel purchase order
  static async cancelOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const orderRepository = AppDataSource.getRepository(PurchaseOrder);
      const order = await orderRepository.findOne({ where: { id: parseInt(id) } });

      if (!order) {
        return res.status(404).json({ message: "Purchase order not found" });
      }

      // Check if order can be cancelled
      if (["received", "cancelled"].includes(order.status)) {
        return res.status(400).json({ message: "Cannot cancel received or already cancelled orders" });
      }

      // Update order status
      order.status = "cancelled";
      await orderRepository.save(order);

      // Update order items status
      const orderItemRepository = AppDataSource.getRepository(PurchaseOrderItem);
      await orderItemRepository.update(
        { purchase_order_id: parseInt(id) },
        { status: "pending" }
      );

      // Get updated order with items
      return this.getOrderById(req, res);
    } catch (error) {
      console.error("Error in cancelOrder:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
