import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { InterDivisionTransfer } from "../models/inter-division-transfer.model";
import { InterDivisionTransferItem } from "../models/inter-division-transfer-item.model";
import { Division } from "../models/division.model";
import { Item } from "../models/item.model";
import { Warehouse } from "../models/warehouse.model";
import { StorageLocation } from "../models/storage-location.model";
import { Inventory } from "../models/inventory.model";
import { LotTracking } from "../models/lot-tracking.model";

export class InterDivisionTransferController {
  // Get all inter-division transfers
  static async getAllTransfers(req: Request, res: Response) {
    try {
      const { from_division_id, to_division_id, status } = req.query;
      
      const transferRepository = AppDataSource.getRepository(InterDivisionTransfer);
      let queryBuilder = transferRepository.createQueryBuilder("transfer")
        .leftJoinAndSelect("transfer.from_division", "from_division")
        .leftJoinAndSelect("transfer.to_division", "to_division")
        .leftJoinAndSelect("transfer.created_by_user", "created_by");
      
      // Filter by from_division if provided
      if (from_division_id) {
        queryBuilder = queryBuilder.where("transfer.from_division_id = :from_division_id", { from_division_id });
      }
      
      // Filter by to_division if provided
      if (to_division_id) {
        const condition = from_division_id ? "AND" : "WHERE";
        queryBuilder = queryBuilder.andWhere(`transfer.to_division_id = :to_division_id`, { to_division_id });
      }
      
      // Filter by status if provided
      if (status) {
        const condition = (from_division_id || to_division_id) ? "AND" : "WHERE";
        queryBuilder = queryBuilder.andWhere(`transfer.status = :status`, { status });
      }
      
      // Order by creation date descending
      queryBuilder = queryBuilder.orderBy("transfer.created_at", "DESC");
      
      const transfers = await queryBuilder.getMany();

      return res.status(200).json(transfers);
    } catch (error) {
      console.error("Error in getAllTransfers:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Get inter-division transfer by ID
  static async getTransferById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const transferRepository = AppDataSource.getRepository(InterDivisionTransfer);
      const transfer = await transferRepository.findOne({
        where: { id: parseInt(id) },
        relations: ["from_division", "to_division", "created_by_user"]
      });

      if (!transfer) {
        return res.status(404).json({ message: "Inter-division transfer not found" });
      }

      // Get transfer items
      const transferItemRepository = AppDataSource.getRepository(InterDivisionTransferItem);
      const items = await transferItemRepository.find({
        where: { inter_division_transfer_id: parseInt(id) },
        relations: ["item", "uom", "from_warehouse", "from_location", "to_warehouse", "to_location", "lot"],
        order: { id: "ASC" }
      });

      // Return transfer with items
      return res.status(200).json({
        ...transfer,
        items
      });
    } catch (error) {
      console.error("Error in getTransferById:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Create a new inter-division transfer
  static async createTransfer(req: Request, res: Response) {
    try {
      const { 
        from_division_id, 
        to_division_id, 
        transfer_date,
        notes,
        items
      } = req.body;

      // Validate required fields
      if (!from_division_id || !to_division_id || !transfer_date || !items || !items.length) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Validate divisions
      const divisionRepository = AppDataSource.getRepository(Division);
      const fromDivision = await divisionRepository.findOne({ where: { id: from_division_id } });
      if (!fromDivision) {
        return res.status(404).json({ message: "From division not found" });
      }

      const toDivision = await divisionRepository.findOne({ where: { id: to_division_id } });
      if (!toDivision) {
        return res.status(404).json({ message: "To division not found" });
      }

      if (from_division_id === to_division_id) {
        return res.status(400).json({ message: "From and To divisions cannot be the same" });
      }

      // Start transaction
      const queryRunner = AppDataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        // Generate transfer number
        const transferNumber = `IDT-${Date.now().toString().slice(-6)}`;

        // Create new transfer
        const transfer = new InterDivisionTransfer();
        transfer.transfer_number = transferNumber;
        transfer.from_division_id = from_division_id;
        transfer.to_division_id = to_division_id;
        transfer.transfer_date = new Date(transfer_date);
        transfer.status = "draft";
        transfer.notes = notes || null;
        transfer.created_by = (req as any).user.id; // Assuming user ID is set by auth middleware

        const savedTransfer = await queryRunner.manager.save(transfer);

        // Process items
        for (const itemData of items) {
          // Validate item
          const itemRepository = AppDataSource.getRepository(Item);
          const item = await itemRepository.findOne({ where: { id: itemData.item_id } });
          if (!item) {
            throw new Error(`Item with ID ${itemData.item_id} not found`);
          }

          // Validate from warehouse
          const warehouseRepository = AppDataSource.getRepository(Warehouse);
          const fromWarehouse = await warehouseRepository.findOne({ 
            where: { id: itemData.from_warehouse_id, division_id: from_division_id } 
          });
          if (!fromWarehouse) {
            throw new Error(`From warehouse with ID ${itemData.from_warehouse_id} not found in division ${from_division_id}`);
          }

          // Validate to warehouse
          const toWarehouse = await warehouseRepository.findOne({ 
            where: { id: itemData.to_warehouse_id, division_id: to_division_id } 
          });
          if (!toWarehouse) {
            throw new Error(`To warehouse with ID ${itemData.to_warehouse_id} not found in division ${to_division_id}`);
          }

          // Validate from location if provided
          if (itemData.from_location_id) {
            const locationRepository = AppDataSource.getRepository(StorageLocation);
            const fromLocation = await locationRepository.findOne({ 
              where: { id: itemData.from_location_id, warehouse_id: itemData.from_warehouse_id } 
            });
            if (!fromLocation) {
              throw new Error(`From location with ID ${itemData.from_location_id} not found in warehouse ${itemData.from_warehouse_id}`);
            }
          }

          // Validate to location if provided
          if (itemData.to_location_id) {
            const locationRepository = AppDataSource.getRepository(StorageLocation);
            const toLocation = await locationRepository.findOne({ 
              where: { id: itemData.to_location_id, warehouse_id: itemData.to_warehouse_id } 
            });
            if (!toLocation) {
              throw new Error(`To location with ID ${itemData.to_location_id} not found in warehouse ${itemData.to_warehouse_id}`);
            }
          }

          // Create transfer item
          const transferItem = new InterDivisionTransferItem();
          transferItem.inter_division_transfer_id = savedTransfer.id;
          transferItem.item_id = itemData.item_id;
          transferItem.quantity = itemData.quantity;
          transferItem.uom_id = itemData.uom_id;
          transferItem.from_warehouse_id = itemData.from_warehouse_id;
          transferItem.from_location_id = itemData.from_location_id || null;
          transferItem.to_warehouse_id = itemData.to_warehouse_id;
          transferItem.to_location_id = itemData.to_location_id || null;
          transferItem.lot_id = itemData.lot_id || null;
          transferItem.status = "pending";

          await queryRunner.manager.save(transferItem);
        }

        // Commit transaction
        await queryRunner.commitTransaction();

        // Get complete transfer with items
        return this.getTransferById({ params: { id: savedTransfer.id.toString() } } as Request, res);
        
      } catch (error) {
        // Rollback transaction on error
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        // Release query runner
        await queryRunner.release();
      }
    } catch (error) {
      console.error("Error in createTransfer:", error);
      return res.status(500).json({ message: error.message || "Internal server error" });
    }
  }

  // Update inter-division transfer
  static async updateTransfer(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { 
        transfer_date,
        notes,
        status
      } = req.body;

      const transferRepository = AppDataSource.getRepository(InterDivisionTransfer);
      const transfer = await transferRepository.findOne({ where: { id: parseInt(id) } });

      if (!transfer) {
        return res.status(404).json({ message: "Inter-division transfer not found" });
      }

      // Check if transfer can be updated
      if (["completed", "cancelled"].includes(transfer.status)) {
        return res.status(400).json({ message: "Cannot update completed or cancelled transfers" });
      }

      // Update transfer fields
      if (transfer_date) transfer.transfer_date = new Date(transfer_date);
      if (notes !== undefined) transfer.notes = notes;
      if (status) transfer.status = status;

      await transferRepository.save(transfer);

      // Get updated transfer with items
      return this.getTransferById(req, res);
    } catch (error) {
      console.error("Error in updateTransfer:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Delete inter-division transfer
  static async deleteTransfer(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Start transaction
      const queryRunner = AppDataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        // Delete transfer items first
        const transferItemRepository = AppDataSource.getRepository(InterDivisionTransferItem);
        await transferItemRepository.delete({ inter_division_transfer_id: parseInt(id) });

        // Delete transfer
        const transferRepository = AppDataSource.getRepository(InterDivisionTransfer);
        const transfer = await transferRepository.findOne({ where: { id: parseInt(id) } });

        if (!transfer) {
          return res.status(404).json({ message: "Inter-division transfer not found" });
        }

        // Check if transfer can be deleted
        if (["in_progress", "completed"].includes(transfer.status)) {
          return res.status(400).json({ message: "Cannot delete in-progress or completed transfers" });
        }

        await transferRepository.remove(transfer);

        // Commit transaction
        await queryRunner.commitTransaction();

        return res.status(200).json({ message: "Inter-division transfer deleted successfully" });
      } catch (error) {
        // Rollback transaction on error
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        // Release query runner
        await queryRunner.release();
      }
    } catch (error) {
      console.error("Error in deleteTransfer:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Process inter-division transfer
  static async processTransfer(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Start transaction
      const queryRunner = AppDataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        // Get transfer
        const transferRepository = AppDataSource.getRepository(InterDivisionTransfer);
        const transfer = await transferRepository.findOne({ 
          where: { id: parseInt(id) },
          relations: ["from_division", "to_division"]
        });

        if (!transfer) {
          return res.status(404).json({ message: "Inter-division transfer not found" });
        }

        // Check if transfer can be processed
        if (transfer.status !== "draft") {
          return res.status(400).json({ message: `Cannot process transfer in ${transfer.status} status` });
        }

        // Get transfer items
        const transferItemRepository = AppDataSource.getRepository(InterDivisionTransferItem);
        const items = await transferItemRepository.find({
          where: { inter_division_transfer_id: parseInt(id) },
          relations: ["item", "uom", "from_warehouse", "from_location", "to_warehouse", "to_location", "lot"]
        });

        // Process each item
        for (const item of items) {
          // Check inventory in source location
          const inventoryRepository = AppDataSource.getRepository(Inventory);
          let inventoryQuery = {
            item_id: item.item_id,
            warehouse_id: item.from_warehouse_id,
            division_id: transfer.from_division_id
          };
          
          if (item.from_location_id) {
            inventoryQuery['location_id'] = item.from_location_id;
          }
          
          if (item.lot_id) {
            inventoryQuery['lot_id'] = item.lot_id;
          }
          
          const sourceInventory = await inventoryRepository.findOne({ where: inventoryQuery });
          
          if (!sourceInventory || sourceInventory.quantity < item.quantity) {
            throw new Error(`Insufficient inventory for item ${item.item.name} in source location`);
          }
          
          // Reduce inventory in source location
          sourceInventory.quantity -= item.quantity;
          await queryRunner.manager.save(sourceInventory);
          
          // Add inventory in destination location
          let destInventoryQuery = {
            item_id: item.item_id,
            warehouse_id: item.to_warehouse_id,
            division_id: transfer.to_division_id
          };
          
          if (item.to_location_id) {
            destInventoryQuery['location_id'] = item.to_location_id;
          }
          
          if (item.lot_id) {
            destInventoryQuery['lot_id'] = item.lot_id;
          }
          
          let destInventory = await inventoryRepository.findOne({ where: destInventoryQuery });
          
          if (destInventory) {
            // Update existing inventory
            destInventory.quantity += item.quantity;
            await queryRunner.manager.save(destInventory);
          } else {
            // Create new inventory record
            destInventory = new Inventory();
            destInventory.item_id = item.item_id;
            destInventory.warehouse_id = item.to_warehouse_id;
            destInventory.location_id = item.to_location_id;
            destInventory.division_id = transfer.to_division_id;
            destInventory.lot_id = item.lot_id;
            destInventory.quantity = item.quantity;
            await queryRunner.manager.save(destInventory);
          }
          
          // Update transfer item status
          item.status = "transferred";
          await queryRunner.manager.save(item);
        }
        
        // Up<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>