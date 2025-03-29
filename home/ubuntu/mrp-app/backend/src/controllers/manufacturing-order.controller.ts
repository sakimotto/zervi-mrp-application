import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { ManufacturingOrder } from "../models/manufacturing-order.model";
import { ManufacturingOrderOperation } from "../models/manufacturing-order-operation.model";
import { ManufacturingOrderMaterial } from "../models/manufacturing-order-material.model";
import { Item } from "../models/item.model";
import { Bom } from "../models/bom.model";
import { BomComponent } from "../models/bom-component.model";
import { Operation } from "../models/operation.model";
import { Workstation } from "../models/workstation.model";

export class ManufacturingOrderController {
  // Get all manufacturing orders
  static async getAllManufacturingOrders(req: Request, res: Response) {
    try {
      const { division_id, status } = req.query;
      
      const moRepository = AppDataSource.getRepository(ManufacturingOrder);
      let queryBuilder = moRepository.createQueryBuilder("mo")
        .leftJoinAndSelect("mo.division", "division")
        .leftJoinAndSelect("mo.item", "item");
      
      // Filter by division if provided
      if (division_id) {
        queryBuilder = queryBuilder.where("mo.division_id = :division_id", { division_id });
      }
      
      // Filter by status if provided
      if (status) {
        const condition = division_id ? "AND" : "WHERE";
        queryBuilder = queryBuilder.andWhere(`mo.status = :status`, { status });
      }
      
      // Order by creation date descending
      queryBuilder = queryBuilder.orderBy("mo.created_at", "DESC");
      
      const orders = await queryBuilder.getMany();

      return res.status(200).json(orders);
    } catch (error) {
      console.error("Error in getAllManufacturingOrders:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Get manufacturing order by ID
  static async getManufacturingOrderById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const moRepository = AppDataSource.getRepository(ManufacturingOrder);
      const order = await moRepository.findOne({
        where: { id: parseInt(id) },
        relations: ["division", "item", "bom"]
      });

      if (!order) {
        return res.status(404).json({ message: "Manufacturing order not found" });
      }

      // Get operations
      const moOperationRepository = AppDataSource.getRepository(ManufacturingOrderOperation);
      const operations = await moOperationRepository.find({
        where: { manufacturing_order_id: parseInt(id) },
        relations: ["operation", "workstation"],
        order: { id: "ASC" }
      });

      // Get materials
      const moMaterialRepository = AppDataSource.getRepository(ManufacturingOrderMaterial);
      const materials = await moMaterialRepository.find({
        where: { manufacturing_order_id: parseInt(id) },
        relations: ["item", "bom_component", "warehouse", "location", "lot"],
        order: { id: "ASC" }
      });

      // Return order with operations and materials
      return res.status(200).json({
        ...order,
        operations,
        materials
      });
    } catch (error) {
      console.error("Error in getManufacturingOrderById:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Create a new manufacturing order
  static async createManufacturingOrder(req: Request, res: Response) {
    try {
      const { 
        division_id, 
        item_id, 
        bom_id,
        order_number,
        order_type,
        quantity,
        planned_start_date,
        planned_end_date,
        priority,
        status,
        notes
      } = req.body;

      // Validate required fields
      if (!division_id || !item_id || !quantity || !planned_start_date) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Validate item
      const itemRepository = AppDataSource.getRepository(Item);
      const item = await itemRepository.findOne({ where: { id: item_id } });
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      // Validate BOM if provided
      let bom = null;
      if (bom_id) {
        const bomRepository = AppDataSource.getRepository(Bom);
        bom = await bomRepository.findOne({ 
          where: { id: bom_id, item_id: item_id },
          relations: ["item"]
        });
        
        if (!bom) {
          return res.status(404).json({ message: "BOM not found or does not match the item" });
        }
      } else {
        // Try to find the latest active BOM for the item
        const bomRepository = AppDataSource.getRepository(Bom);
        bom = await bomRepository.findOne({
          where: { item_id: item_id, status: "active" },
          order: { version: "DESC" }
        });
        
        if (!bom) {
          return res.status(400).json({ message: "No active BOM found for this item. Please specify a BOM." });
        }
      }

      // Start transaction
      const queryRunner = AppDataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        // Generate order number if not provided
        const generatedOrderNumber = order_number || `MO-${Date.now().toString().slice(-6)}`;

        // Create new manufacturing order
        const order = new ManufacturingOrder();
        order.division_id = division_id;
        order.item_id = item_id;
        order.bom_id = bom.id;
        order.order_number = generatedOrderNumber;
        order.order_type = order_type || "make_to_stock";
        order.quantity = quantity;
        order.planned_start_date = new Date(planned_start_date);
        order.planned_end_date = planned_end_date ? new Date(planned_end_date) : null;
        order.priority = priority || "medium";
        order.status = status || "draft";
        order.notes = notes || null;

        const savedOrder = await queryRunner.manager.save(order);

        // Get BOM components to create materials
        const bomComponentRepository = AppDataSource.getRepository(BomComponent);
        const bomComponents = await bomComponentRepository.find({
          where: { bom_id: bom.id },
          relations: ["component_item", "uom"]
        });

        // Create materials from BOM components
        for (const component of bomComponents) {
          const material = new ManufacturingOrderMaterial();
          material.manufacturing_order_id = savedOrder.id;
          material.item_id = component.component_item_id;
          material.bom_component_id = component.id;
          material.planned_quantity = component.quantity * quantity;
          material.issued_quantity = 0;
          material.returned_quantity = 0;
          material.warehouse_id = 1; // Default warehouse, should be configurable
          
          await queryRunner.manager.save(material);
        }

        // Get routing operations if available
        // This is simplified - in a real system, you would get operations from a routing table
        // For now, we'll create a default operation
        const operation = new ManufacturingOrderOperation();
        operation.manufacturing_order_id = savedOrder.id;
        operation.operation_id = 1; // Default operation, should be from routing
        operation.operation_type = "general";
        operation.workstation_id = 1; // Default workstation, should be configurable
        operation.status = "pending";
        operation.planned_start_date = new Date(planned_start_date);
        operation.planned_end_date = planned_end_date ? new Date(planned_end_date) : null;
        
        await queryRunner.manager.save(operation);

        // Commit transaction
        await queryRunner.commitTransaction();

        // Get complete order with operations and materials
        return this.getManufacturingOrderById({ params: { id: savedOrder.id.toString() } } as Request, res);
        
      } catch (error) {
        // Rollback transaction on error
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        // Release query runner
        await queryRunner.release();
      }
    } catch (error) {
      console.error("Error in createManufacturingOrder:", error);
      return res.status(500).json({ message: error.message || "Internal server error" });
    }
  }

  // Update manufacturing order
  static async updateManufacturingOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { 
        order_type,
        quantity,
        planned_start_date,
        planned_end_date,
        priority,
        status,
        notes
      } = req.body;

      const moRepository = AppDataSource.getRepository(ManufacturingOrder);
      const order = await moRepository.findOne({ where: { id: parseInt(id) } });

      if (!order) {
        return res.status(404).json({ message: "Manufacturing order not found" });
      }

      // Check if order can be updated
      if (["completed", "cancelled"].includes(order.status)) {
        return res.status(400).json({ message: "Cannot update completed or cancelled orders" });
      }

      // Update order fields
      if (order_type) order.order_type = order_type;
      if (quantity !== undefined) order.quantity = quantity;
      if (planned_start_date) order.planned_start_date = new Date(planned_start_date);
      if (planned_end_date) order.planned_end_date = new Date(planned_end_date);
      if (priority) order.priority = priority;
      if (status) order.status = status;
      if (notes !== undefined) order.notes = notes;

      await moRepository.save(order);

      // Get updated order with operations and materials
      return this.getManufacturingOrderById(req, res);
    } catch (error) {
      console.error("Error in updateManufacturingOrder:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Delete manufacturing order
  static async deleteManufacturingOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Start transaction
      const queryRunner = AppDataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        // Delete operations first
        const moOperationRepository = AppDataSource.getRepository(ManufacturingOrderOperation);
        await moOperationRepository.delete({ manufacturing_order_id: parseInt(id) });

        // Delete materials
        const moMaterialRepository = AppDataSource.getRepository(ManufacturingOrderMaterial);
        await moMaterialRepository.delete({ manufacturing_order_id: parseInt(id) });

        // Delete order
        const moRepository = AppDataSource.getRepository(ManufacturingOrder);
        const order = await moRepository.findOne({ where: { id: parseInt(id) } });

        if (!order) {
          return res.status(404).json({ message: "Manufacturing order not found" });
        }

        // Check if order can be deleted
        if (["in_progress", "completed"].includes(order.status)) {
          return res.status(400).json({ message: "Cannot delete in-progress or completed orders" });
        }

        await moRepository.remove(order);

        // Commit transaction
        await queryRunner.commitTransaction();

        return res.status(200).json({ message: "Manufacturing order deleted successfully" });
      } catch (error) {
        // Rollback transaction on error
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        // Release query runner
        await queryRunner.release();
      }
    } catch (error) {
      console.error("Error in deleteManufacturingOrder:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Update manufacturing order status
  static async updateOrderStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }

      const moRepository = AppDataSource.getRepository(ManufacturingOrder);
      const order = await moRepository.findOne({ where: { id: parseInt(id) } });

      if (!order) {
        return res.status(404).json({ message: "Manufacturing order not found" });
      }

      // Validate status transition
      const validTransitions = {
        draft: ["planned", "cancelled"],
        planned: ["in_progress", "cancelled"],
        in_progress: ["on_hold", "completed"],
        on_hold: ["in_progress", "cancelled"],
        completed: [],
        cancelled: []
      };

      if (!validTransitions[order.status].includes(status)) {
        return res.status(400).json({ 
          message: `Invalid status transition from ${order.status} to ${status}` 
        });
      }

      // Update status
      order.status = status;
      
      // Update actual dates if needed
      if (status === "in_progress" && !order.actual_start_date) {
        order.actual_start_date = new Date();
      } else if (status === "completed" && !order.actual_end_date) {
        order.actual_end_date = new Date();
      }

      await moRepository.save(order);

      return res.status(200).json(order);
    } catch (error) {
      console.error("Error in updateOrderStatus:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Add operation to manufacturing order
  static async addOperation(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const {
        operation_id,
        operation_type,
        workstation_id,
        planned_start_date,
        planned_end_date,
        status,
        notes
      } = req.body;

      // Validate required fields
      if (!operation_id || !workstation_id || !planned_start_date) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Validate manufacturing order
      const moRepository = AppDataSource.getRepository(ManufacturingOrder);
      const order = await moRepository.findOne({ where: { id: parseInt(id) } });
      if (!order) {
        return res.status(404).json({ message: "Manufacturing order not found" });
      }

      // Validate operation
      const operationRepository = AppDataSource.getRepository(Operation);
      const operation = await operationRepository.findOne({ where: { id: operation_id } });
      if (!operation) {
        return res.status(404).json({ message: "Operation not found" });
      }

      // Validate workstation
      const workstationRepository = AppDataSource.getRepository(Workstation);
      const workstation = await workstationRepository.findOne({ where: { id: workstation_id } });
      if (!workstation) {
        return res.status(404).json({ message: "Workstation not found" });
      }

      // Create operation
      const moOperation = new ManufacturingOrderOperation();
      moOperation.manufacturing_order_id = parseInt(id);
      moOperation.operation_id = operation_id;
      moOperation.operation_type = operation_type || "general";
      moOperation.workstation_id = workstation_id;
      moOperation.status = status || "pending";
      moOperation.planned_start_date = new Date(planned_start_date);
      moOperation.planned_end_date = planned_end_date ? new Date(planned_end_date) : null;
      moOperation.notes = notes || null;

      const moOperationRepository = AppDataSource.getRepository(ManufacturingOrderOperation);
      await moOperationRepository.save(moOperation);

      return res.status(201).json(moOperation);
    } catch (error) {
      console.error("Error in addOperation:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Update operation
  static async updateOperation(req: Request, res: Response) {
    try {
      const<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>