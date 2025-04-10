// Placeholder for manufacturing-order.controller.ts
import { Request, Response } from "express";
import { getRepository, getConnection } from "typeorm";
import { ManufacturingOrder } from "../models/manufacturing-order.model";
import { ManufacturingOrderOperation } from "../models/manufacturing-order-operation.model";
import { BOM } from "../models/bom.model";
import { BOMComponent } from "../models/bom-component.model";
import { Item } from "../models/item.model";

/**
 * Manufacturing Order Controller
 * 
 * Handles CRUD operations for Manufacturing Order entities in the Zervi MRP system.
 */
export class ManufacturingOrderController {
  /**
   * Get all manufacturing orders with optional filtering
   * 
   * @param req Request object
   * @param res Response object
   */
  async getAll(req: Request, res: Response) {
    try {
      const manufacturingOrderRepository = getRepository(ManufacturingOrder);
      
      // Extract query parameters
      const { 
        division_id, 
        item_id,
        status,
        start_date,
        end_date,
        search,
        page = 1,
        limit = 10,
        sort_by = "id",
        sort_order = "ASC"
      } = req.query;
      
      // Build query
      let query = manufacturingOrderRepository.createQueryBuilder("order")
        .leftJoinAndSelect("order.division", "division")
        .leftJoinAndSelect("order.item", "item")
        .leftJoinAndSelect("order.bom", "bom")
        .leftJoinAndSelect("order.createdBy", "createdBy")
        .leftJoinAndSelect("order.assignedTo", "assignedTo");
      
      // Apply filters
      if (division_id) {
        query = query.andWhere("order.division_id = :division_id", { division_id });
      }
      
      if (item_id) {
        query = query.andWhere("order.item_id = :item_id", { item_id });
      }
      
      if (status) {
        query = query.andWhere("order.status = :status", { status });
      }
      
      if (start_date) {
        query = query.andWhere("order.planned_start_date >= :start_date", { start_date });
      }
      
      if (end_date) {
        query = query.andWhere("order.planned_end_date <= :end_date", { end_date });
      }
      
      if (search) {
        query = query.andWhere(
          "(order.order_number ILIKE :search OR order.notes ILIKE :search OR item.name ILIKE :search)",
          { search: `%${search}%` }
        );
      }
      
      // Apply sorting
      query = query.orderBy(`order.${sort_by}`, sort_order as "ASC" | "DESC");
      
      // Apply pagination
      const skip = (Number(page) - 1) * Number(limit);
      query = query.skip(skip).take(Number(limit));
      
      // Execute query
      const [orders, count] = await query.getManyAndCount();
      
      // Return response
      return res.status(200).json({
        value: orders,
        Count: count
      });
    } catch (error) {
      console.error("Error in getAll manufacturing orders:", error);
      return res.status(500).json({
        message: "Internal server error",
        error: error.message
      });
    }
  }
  
  /**
   * Get manufacturing order by ID with operations
   * 
   * @param req Request object
   * @param res Response object
   */
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const manufacturingOrderRepository = getRepository(ManufacturingOrder);
      const order = await manufacturingOrderRepository.findOne({
        where: { id: Number(id) },
        relations: [
          "division", 
          "item", 
          "bom", 
          "createdBy", 
          "assignedTo", 
          "parentOrder",
          "operations",
          "operations.assignedTo"
        ]
      });
      
      if (!order) {
        return res.status(404).json({
          message: "Manufacturing order not found"
        });
      }
      
      return res.status(200).json(order);
    } catch (error) {
      console.error("Error in getById manufacturing order:", error);
      return res.status(500).json({
        message: "Internal server error",
        error: error.message
      });
    }
  }
  
  /**
   * Create new manufacturing order with operations
   * 
   * @param req Request object
   * @param res Response object
   */
  async create(req: Request, res: Response) {
    // Start transaction
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      const manufacturingOrderRepository = queryRunner.manager.getRepository(ManufacturingOrder);
      const manufacturingOrderOperationRepository = queryRunner.manager.getRepository(ManufacturingOrderOperation);
      const itemRepository = queryRunner.manager.getRepository(Item);
      const bomRepository = queryRunner.manager.getRepository(BOM);
      
      // Extract order data and operations from request
      const { operations, ...orderData } = req.body;
      
      // Validate required fields
      const {
        division_id,
        item_id,
        quantity,
        planned_start_date,
        planned_end_date
      } = orderData;
      
      if (!division_id || !item_id || !quantity || !planned_start_date || !planned_end_date) {
        return res.status(400).json({
          message: "Missing required fields: division_id, item_id, quantity, planned_start_date, planned_end_date"
        });
      }
      
      // Check if item exists
      const item = await itemRepository.findOne({
        where: { id: Number(item_id) }
      });
      
      if (!item) {
        return res.status(404).json({
          message: "Item not found"
        });
      }
      
      // Generate order number
      const orderNumber = await this.generateOrderNumber(queryRunner, division_id);
      
      // If BOM ID is not provided, try to find default BOM for the item
      if (!orderData.bom_id) {
        const defaultBom = await bomRepository.findOne({
          where: {
            item_id: Number(item_id),
            is_default: true,
            is_active: true
          }
        });
        
        if (defaultBom) {
          orderData.bom_id = defaultBom.id;
        }
      }
      
      // Create new manufacturing order
      const newOrder = manufacturingOrderRepository.create({
        ...orderData,
        order_number: orderNumber
      });
      
      const savedOrder = await manufacturingOrderRepository.save(newOrder);
      
      // Create operations if provided
      if (operations && Array.isArray(operations) && operations.length > 0) {
        const orderOperations = operations.map((operation, index) => {
          return manufacturingOrderOperationRepository.create({
            ...operation,
            manufacturing_order_id: savedOrder.id,
            operation_number: operation.operation_number || index + 1
          });
        });
        
        await manufacturingOrderOperationRepository.save(orderOperations);
      } else {
        // If no operations provided, create default operations based on BOM if available
        if (orderData.bom_id) {
          const bom = await bomRepository.findOne({
            where: { id: Number(orderData.bom_id) },
            relations: ["components", "components.item"]
          });
          
          if (bom && bom.components && bom.components.length > 0) {
            // Create a setup operation
            const setupOperation = manufacturingOrderOperationRepository.create({
              manufacturing_order_id: savedOrder.id,
              operation_number: 1,
              name: "Setup",
              description: "Initial setup for manufacturing",
              operation_type: "setup",
              planned_hours: 1,
              status: "pending"
            });
            
            // Create operations for each component
            const componentOperations = bom.components.map((component, index) => {
              let operationType = "assembly";
              
              // Try to determine operation type based on component item type
              if (component.item.type === "raw_material") {
                if (component.item.name.toLowerCase().includes("fabric")) {
                  operationType = "cutting";
                } else if (component.item.name.toLowerCase().includes("thread")) {
                  operationType = "sewing";
                }
              }
              
              return manufacturingOrderOperationRepository.create({
                manufacturing_order_id: savedOrder.id,
                operation_number: index + 2, // Start after setup
                name: `Process ${component.item.name}`,
                description: `Process component: ${component.item.name}`,
                operation_type: operationType,
                planned_hours: 2,
                status: "pending"
              });
            });
            
            // Create a quality check operation
            const qualityOperation = manufacturingOrderOperationRepository.create({
              manufacturing_order_id: savedOrder.id,
              operation_number: bom.components.length + 2,
              name: "Quality Check",
              description: "Final quality inspection",
              operation_type: "quality_check",
              planned_hours: 1,
              status: "pending"
            });
            
            // Create a packaging operation
            const packagingOperation = manufacturingOrderOperationRepository.create({
              manufacturing_order_id: savedOrder.id,
              operation_number: bom.components.length + 3,
              name: "Packaging",
              description: "Package finished product",
              operation_type: "packaging",
              planned_hours: 1,
              status: "pending"
            });
            
            // Save all operations
            await manufacturingOrderOperationRepository.save([
              setupOperation,
              ...componentOperations,
              qualityOperation,
              packagingOperation
            ]);
          }
        }
      }
      
      // Reload order with operations
      const orderWithOperations = await manufacturingOrderRepository.findOne({
        where: { id: savedOrder.id },
        relations: [
          "division", 
          "item", 
          "bom", 
          "createdBy", 
          "assignedTo", 
          "operations",
          "operations.assignedTo"
        ]
      });
      
      // Commit transaction
      await queryRunner.commitTransaction();
      
      return res.status(201).json(orderWithOperations);
    } catch (error) {
      // Rollback transaction on error
      await queryRunner.rollbackTransaction();
      
      console.error("Error in create manufacturing order:", error);
      return res.status(500).json({
        message: "Internal server error",
        error: error.message
      });
    } finally {
      // Release query runner
      await queryRunner.release();
    }
  }
  
  /**
   * Update existing manufacturing order
   * 
   * @param req Request object
   * @param res Response object
   */
  async update(req: Request, res: Response) {
    // Start transaction
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      const { id } = req.params;
      const manufacturingOrderRepository = queryRunner.manager.getRepository(ManufacturingOrder);
      
      // Extract order data and operations from request
      const { operations, ...orderData } = req.body;
      
      // Check if order exists
      const order = await manufacturingOrderRepository.findOne({
        where: { id: Number(id) }
      });
      
      if (!order) {
        return res.status(404).json({
          message: "Manufacturing order not found"
        });
      }
      
      // Validate status transitions
      if (orderData.status && orderData.status !== order.status) {
        const isValidTransition = this.validateStatusTransition(order.status, orderData.status);
        
        if (!isValidTransition) {
          return res.status(400).json({
            message: `Invalid status transition from ${order.status} to ${orderData.status}`
          });
        }
        
        // Update actual dates based on status
        if (orderData.status === "in_progress" && !order.actual_start_date) {
          orderData.actual_start_date = new Date();
        } else if (orderData.status === "completed" && !order.actual_end_date) {
          orderData.actual_end_date = new Date();
        }
      }
      
      // Update order
      const updatedOrder = await manufacturingOrderRepository.save({
        ...order,
        ...orderData
      });
      
      // Operations will be handled by separate endpoints
      
      // Commit transaction
      await queryRunner.commitTransaction();
      
      return res.status(200).json(updatedOrder);
    } catch (error) {
      // Rollback transaction on error
      await queryRunner.rollbackTransaction();
      
      console.error("Error in update manufacturing order:", error);
      return res.status(500).json({
        message: "Internal server error",
        error: error.message
      });
    } finally {
      // Release query runner
      await queryRunner.release();
    }
  }
  
  /**
   * Delete manufacturing order
   * 
   * @param req Request object
   * @param res Response object
   */
  async delete(req: Request, res: Response) {
    // Start transaction
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      const { id } = req.params;
      const manufacturingOrderRepository = queryRunner.manager.getRepository(ManufacturingOrder);
      
      // Check if order exists
      const order = await manufacturingOrderRepository.findOne({
        where: { id: Number(id) }
      });
      
      if (!order) {
        return res.status(404).json({
          message: "Manufacturing order not found"
        });
      }
      
      // Only allow deletion of draft or cancelled orders
      if (order.status !== "draft" && order.status !== "cancelled") {
        return res.status(400).json({
          message: "Only draft or cancelled orders can be deleted"
        });
      }
      
      // Delete order (this will cascade to operations due to foreign key constraints)
      await manufacturingOrderRepository.remove(order);
      
      // Commit transaction
      await queryRunner.commitTransaction();
      
      return res.status(200).json({
        message: "Manufacturing order deleted successfully"
      });
    } catch (error) {
      // Rollback transaction on error
      await queryRunner.rollbackTransaction();
      
      console.error("Error in delete manufacturing order:", error);
      return res.status(500).json({
        message: "Internal server error",
        error: error.message
      });
    } finally {
      // Release query runner
      await queryRunner.release();
    }
  }
  
  /**
   * Cancel manufacturing order
   * 
   * @param req Request object
   * @param res Response object
   */
  async cancel(req: Request, res: Response) {
    // Start transaction
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      const { id } = req.params;
      const manufacturingOrderRepository = queryRunner.manager.getRepository(ManufacturingOrder);
      const manufacturingOrderOperationRepository = queryRunner.manager.getRepository(ManufacturingOrderOperation);
      
      // Check if order exists
      const order = await manufacturingOrderRepository.findOne({
        where: { id: Number(id) },
        relations: ["operations"]
      });
      
      if (!order) {
        return res.status(404).json({
          message: "Manufacturing order not found"
        });
      }
      
      // Only allow cancellation of draft, planned, or in_progress orders
      if (order.status === "completed" || order.status === "cancelled") {
        return res.status(400).json({
          message: "Completed or already cancelled orders cannot be cancelled"
        });
      }
      
      // Update order status
      order.status = "cancelled";
      await manufacturingOrderRepository.save(order);
      
      // Update operations status
      if (order.operations && order.operations.length > 0) {
        for (const operation of order.operations) {
          if (operation.status !== "completed") {
            operation.status = "on_hold";
          }
        }
        
        await manufacturingOrderOperationRepository.save(order.operations);
      }
      
      // Commit transaction
      await queryRunner.commitTransaction();
      
      return res.status(200).json({
        message: "Manufacturing order cancelled successfully",
        order
      });
    } catch (error) {
      // Rollback transaction on error
      await queryRunner.rollbackTransaction();
      
      console.error("Error in cancel manufacturing order:", error);
      return res.status(500).json({
        message: "Internal server error",
        error: error.message
      });
    } finally {
      // Release query runner
      await queryRunner.release();
    }
  }
  
  /**
   * Get operations for a manufacturing order
   * 
   * @param req Request object
   * @param res Response object
   */
  async getOperations(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const manufacturingOrderOperationRepository = getRepository(ManufacturingOrderOperation);
      const operations = await manufacturingOrderOperationRepository.find({
        where: { manufacturing_order_id: Number(id) },
        relations: ["assignedTo"],
        order: { operation_number: "ASC" }
      });
      
      return res.status(200).json({
        value: operations,
        Count: operations.length
      });
    } catch (error) {
      console.error("Error in getOperations:", error);
      return res.status(500).json({
        message: "Internal server error",
        error: error.message
      });
    }
  }
  
  /**
   * Add operation to manufacturing order
   * 
   * @param req Request object
   * @param res Response object
   */
  async addOperation(req: Request, res: Response) {
    // Start transaction
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      const { id } = req.params;
      const manufacturingOrderRepository = queryRunner.manager.getRepository(ManufacturingOrder);
      const manufacturingOrderOperationRepository = queryRunner.manager.getRepository(ManufacturingOrderOperation);
      
      // Check if order exists
      const order = await manufacturingOrderRepository.findOne({
        where: { id: Number(id) }
      });
      
      if (!order) {
        return res.status(404).json({
          message: "Manufacturing order not found"
        });
      }
      
      // Validate operation data
      const { name, operation_type } = req.body;
      
      if (!name || !operation_type) {
        return res.status(400).json({
          message: "Missing required fields: name, operation_type"
        });
      }
      
      // Get highest operation number
      const maxOperationResult = await manufacturingOrderOperationRepository
        .createQueryBuilder("operation")
        .select("MAX(operation.operation_number)", "maxOperation")
        .where("operation.manufacturing_order_id = :orderId", { orderId: Number(id) })
        .getRawOne();
      
      const nextOperation = maxOperationResult.maxOperation ? maxOperationResult.maxOperation + 1 : 1;
      
      // Create new operation
      const newOperation = manufacturingOrderOperationRepository.create({
        ...req.body,
        manufacturing_order_id: Number(id),
        operation_number: req.body.operation_number || nextOperation
      });
      
      const savedOperation = await manufacturingOrderOperationRepository.save(newOperation);
      
      // Load assignedTo relation
      const operationWithRelations = await manufacturingOrderOperationRepository.findOne({
        where: { id: savedOperation.id },
        relations: ["assignedTo"]
      });
      
      // Commit transaction
      await queryRunner.commitTransaction();
      
      return res.status(201).json(operationWithRelations);
    } catch (error) {
      // Rollback transaction on error
      await queryRunner.rollbackTransaction();
      
      console.error("Error in addOperation:", error);
      return res.status(500).json({
        message: "Internal server error",
        error: error.message
      });
    } finally {
      // Release query runner
      await queryRunner.release();
    }
  }
  
  /**
   * Update operation
   * 
   * @param req Request object
   * @param res Response object
   */
  async updateOperation(req: Request, res: Response) {
    // Start transaction
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      const { id, operationId } = req.params;
      const manufacturingOrderOperationRepository = queryRunner.manager.getRepository(ManufacturingOrderOperation);
      
      // Check if operation exists and belongs to the order
      const operation = await manufacturingOrderOperationRepository.findOne({
        where: {
          id: Number(operationId),
          manufacturing_order_id: Number(id)
        }
      });
      
      if (!operation) {
        return res.status(404).json({
          message: "Operation not found or does not belong to this order"
        });
      }
      
      // Validate status transitions
      if (req.body.status && req.body.status !== operation.status) {
        // Update actual dates based on status
        if (req.body.status === "in_progress" && !operation.actual_start_date) {
          req.body.actual_start_date = new Date();
        } else if (req.body.status === "completed" && !operation.actual_end_date) {
          req.body.actual_end_date = new Date();
        }
      }
      
      // Update operation
      const updatedOperation = await manufacturingOrderOperationRepository.save({
        ...operation,
        ...req.body
      });
      
      // Load assignedTo relation
      const operationWithRelations = await manufacturingOrderOperationRepository.findOne({
        where: { id: updatedOperation.id },
        relations: ["assignedTo"]
      });
      
      // Check if all operations are completed and update order status if needed
      if (req.body.status === "completed") {
        await this.updateOrderStatusBasedOnOperations(queryRunner, Number(id));
      }
      
      // Commit transaction
      await queryRunner.commitTransaction();
      
      return res.status(200).json(operationWithRelations);
    } catch (error) {
      // Rollback transaction on error
      await queryRunner.rollbackTransaction();
      
      console.error("Error in updateOperation:", error);
      return res.status(500).json({
        message: "Internal server error",
        error: error.message
      });
    } finally {
      // Release query runner
      await queryRunner.release();
    }
  }
  
  /**
   * Delete operation
   * 
   * @param req Request object
   * @param res Response object
   */
  async deleteOperation(req: Request, res: Response) {
    // Start transaction
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      const { id, operationId } = req.params;
      const manufacturingOrderOperationRepository = queryRunner.manager.getRepository(ManufacturingOrderOperation);
      
      // Check if operation exists and belongs to the order
      const operation = await manufacturingOrderOperationRepository.findOne({
        where: {
          id: Number(operationId),
          manufacturing_order_id: Number(id)
        }
      });
      
      if (!operation) {
        return res.status(404).json({
          message: "Operation not found or does not belong to this order"
        });
      }
      
      // Only allow deletion of pending operations
      if (operation.status !== "pending") {
        return res.status(400).json({
          message: "Only pending operations can be deleted"
        });
      }
      
      // Delete operation
      await manufacturingOrderOperationRepository.remove(operation);
      
      // Commit transaction
      await queryRunner.commitTransaction();
      
      return res.status(200).json({
        message: "Operation deleted successfully"
      });
    } catch (error) {
      // Rollback transaction on error
      await queryRunner.rollbackTransaction();
      
      console.error("Error in deleteOperation:", error);
      return res.status(500).json({
        message: "Internal server error",
        error: error.message
      });
    } finally {
      // Release query runner
      await queryRunner.release();
    }
  }
  
  /**
   * Generate materials list for manufacturing order
   * 
   * @param req Request object
   * @param res Response object
   */
  async generateMaterialsList(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const manufacturingOrderRepository = getRepository(ManufacturingOrder);
      const bomRepository = getRepository(BOM);
      const bomComponentRepository = getRepository(BOMComponent);
      
      // Check if order exists
      const order = await manufacturingOrderRepository.findOne({
        where: { id: Number(id) },
        relations: ["item", "bom"]
      });
      
      if (!order) {
        return res.status(404).json({
          message: "Manufacturing order not found"
        });
      }
      
      // If BOM is not specified, try to find default BOM
      let bomId = order.bom_id;
      if (!bomId) {
        const defaultBom = await bomRepository.findOne({
          where: {
            item_id: order.item_id,
            is_default: true,
            is_active: true
          }
        });
        
        if (defaultBom) {
          bomId = defaultBom.id;
        } else {
          return res.status(404).json({
            message: "No BOM found for this item"
          });
        }
      }
      
      // Function to recursively explode BOM
      const explodeBOMRecursive = async (bomId, parentQuantity, level = 0, path = []) => {
        // Check for circular references
        if (path.includes(bomId)) {
          throw new Error(`Circular reference detected in BOM structure: ${path.join(' -> ')} -> ${bomId}`);
        }
        
        // Get components
        const components = await bomComponentRepository.find({
          where: { bom_id: bomId },
          relations: ["item"]
        });
        
        let result = [];
        
        // Process each component
        for (const component of components) {
          const componentQuantity = Number(component.quantity) * Number(parentQuantity);
          
          // Add component to result
          result.push({
            item_id: component.item_id,
            item_code: component.item.item_code,
            name: component.item.name,
            type: component.item.type,
            quantity: componentQuantity,
            level,
            waste_percentage: component.waste_percentage,
            gross_quantity: componentQuantity * (1 + (component.waste_percentage / 100))
          });
          
          // If component is a manufactured item, check if it has a BOM
          if (component.item.type === 'finished_product' || component.item.type === 'semi_finished') {
            // Find default BOM for this item
            const itemBOM = await bomRepository.findOne({
              where: {
                item_id: component.item_id,
                is_default: true,
                is_active: true
              }
            });
            
            if (itemBOM) {
              // Recursively explode this BOM
              const subComponents = await explodeBOMRecursive(
                itemBOM.id,
                componentQuantity,
                level + 1,
                [...path, bomId]
              );
              
              // Add sub-components to result
              result = result.concat(subComponents);
            }
          }
        }
        
        return result;
      };
      
      // Start explosion process
      const explodedComponents = await explodeBOMRecursive(bomId, order.quantity, 0, []);
      
      // Group by item_id and sum quantities
      const groupedComponents = {};
      explodedComponents.forEach(component => {
        if (!groupedComponents[component.item_id]) {
          groupedComponents[component.item_id] = { ...component, total_quantity: 0, total_gross_quantity: 0 };
        }
        groupedComponents[component.item_id].total_quantity += component.quantity;
        groupedComponents[component.item_id].total_gross_quantity += component.gross_quantity;
      });
      
      return res.status(200).json({
        order: {
          id: order.id,
          order_number: order.order_number,
          item: order.item
        },
        quantity: order.quantity,
        detailed_components: explodedComponents,
        grouped_components: Object.values(groupedComponents)
      });
    } catch (error) {
      console.error("Error in generateMaterialsList:", error);
      return res.status(500).json({
        message: "Internal server error",
        error: error.message
      });
    }
  }
  
  /**
   * Generate order number
   * 
   * @param queryRunner Query runner
   * @param divisionId Division ID
   * @returns Generated order number
   */
  private async generateOrderNumber(queryRunner, divisionId) {
    const manufacturingOrderRepository = queryRunner.manager.getRepository(ManufacturingOrder);
    
    // Get current date
    const now = new Date();
    const year = now.getFullYear().toString().substr(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    
    // Get division code
    const divisionRepository = queryRunner.manager.getRepository("Division");
    const division = await divisionRepository.findOne({
      where: { id: Number(divisionId) }
    });
    
    const divisionCode = division?.code || 'ZV';
    
    // Get count of orders for this division in current month
    const count = await manufacturingOrderRepository.count({
      where: {
        division_id: Number(divisionId),
        created_at: Between(
          new Date(`${now.getFullYear()}-${now.getMonth() + 1}-01`),
          new Date(now.getFullYear(), now.getMonth() + 1, 0)
        )
      }
    });
    
    // Generate order number: DIV-YY-MM-XXXX
    const orderNumber = `${divisionCode}-${year}${month}-${(count + 1).toString().padStart(4, '0')}`;
    
    return orderNumber;
  }
  
  /**
   * Validate status transition
   * 
   * @param currentStatus Current status
   * @param newStatus New status
   * @returns Whether the transition is valid
   */
  private validateStatusTransition(currentStatus, newStatus) {
    // Define valid transitions
    const validTransitions = {
      draft: ["planned", "cancelled"],
      planned: ["in_progress", "cancelled"],
      in_progress: ["completed", "cancelled"],
      completed: [],
      cancelled: ["draft"]
    };
    
    return validTransitions[currentStatus].includes(newStatus);
  }
  
  /**
   * Update order status based on operations
   * 
   * @param queryRunner Query runner
   * @param orderId Order ID
   */
  private async updateOrderStatusBasedOnOperations(queryRunner, orderId) {
    const manufacturingOrderRepository = queryRunner.manager.getRepository(ManufacturingOrder);
    const manufacturingOrderOperationRepository = queryRunner.manager.getRepository(ManufacturingOrderOperation);
    
    // Get order
    const order = await manufacturingOrderRepository.findOne({
      where: { id: orderId }
    });
    
    if (!order) {
      return;
    }
    
    // Get operations
    const operations = await manufacturingOrderOperationRepository.find({
      where: { manufacturing_order_id: orderId }
    });
    
    if (!operations || operations.length === 0) {
      return;
    }
    
    // Check if all operations are completed
    const allCompleted = operations.every(op => op.status === "completed");
    
    if (allCompleted && order.status !== "completed") {
      // Update order status
      order.status = "completed";
      order.actual_end_date = new Date();
      order.completed_quantity = order.quantity;
      
      await manufacturingOrderRepository.save(order);
    } else if (!allCompleted && operations.some(op => op.status === "in_progress") && order.status !== "in_progress") {
      // Update order status to in_progress if any operation is in_progress
      order.status = "in_progress";
      
      if (!order.actual_start_date) {
        order.actual_start_date = new Date();
      }
      
      await manufacturingOrderRepository.save(order);
    }
  }
}

