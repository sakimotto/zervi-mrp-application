import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { Item } from "../models/item.model";
import { ItemCategory } from "../models/item-category.model";
import { UnitOfMeasurement } from "../models/unit-of-measurement.model";
import { Supplier } from "../models/supplier.model";

export class ItemController {
  // Get all items
  static async getAllItems(req: Request, res: Response) {
    try {
      const { division_id } = req.query;
      
      const itemRepository = AppDataSource.getRepository(Item);
      let queryBuilder = itemRepository.createQueryBuilder("item")
        .leftJoinAndSelect("item.category", "category")
        .leftJoinAndSelect("item.uom", "uom")
        .leftJoinAndSelect("item.default_supplier", "supplier");
      
      // Filter by division if provided
      if (division_id) {
        queryBuilder = queryBuilder.where("item.division_id = :division_id", { division_id });
      }
      
      const items = await queryBuilder.getMany();

      return res.status(200).json(items);
    } catch (error) {
      console.error("Error in getAllItems:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Get item by ID
  static async getItemById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const itemRepository = AppDataSource.getRepository(Item);
      const item = await itemRepository.findOne({
        where: { id: parseInt(id) },
        relations: ["division", "category", "uom", "default_supplier"]
      });

      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      return res.status(200).json(item);
    } catch (error) {
      console.error("Error in getItemById:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Create a new item
  static async createItem(req: Request, res: Response) {
    try {
      const { 
        division_id, 
        item_code, 
        name, 
        description, 
        type, 
        category_id, 
        uom_id, 
        default_supplier_id,
        min_stock_level,
        reorder_point,
        lead_time_days,
        is_active
      } = req.body;

      // Validate required fields
      if (!division_id || !item_code || !name || !category_id || !uom_id) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Check if item code already exists in the division
      const itemRepository = AppDataSource.getRepository(Item);
      const existingItem = await itemRepository.findOne({ 
        where: { item_code, division_id } 
      });

      if (existingItem) {
        return res.status(400).json({ message: "Item code already exists in this division" });
      }

      // Validate category
      const categoryRepository = AppDataSource.getRepository(ItemCategory);
      const category = await categoryRepository.findOne({ where: { id: category_id } });
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      // Validate UOM
      const uomRepository = AppDataSource.getRepository(UnitOfMeasurement);
      const uom = await uomRepository.findOne({ where: { id: uom_id } });
      if (!uom) {
        return res.status(404).json({ message: "Unit of measurement not found" });
      }

      // Validate supplier if provided
      if (default_supplier_id) {
        const supplierRepository = AppDataSource.getRepository(Supplier);
        const supplier = await supplierRepository.findOne({ where: { id: default_supplier_id } });
        if (!supplier) {
          return res.status(404).json({ message: "Supplier not found" });
        }
      }

      // Create new item
      const item = new Item();
      item.division_id = division_id;
      item.item_code = item_code;
      item.name = name;
      item.description = description || null;
      item.type = type || "raw_material";
      item.category_id = category_id;
      item.uom_id = uom_id;
      item.default_supplier_id = default_supplier_id || null;
      item.min_stock_level = min_stock_level || 0;
      item.reorder_point = reorder_point || 0;
      item.lead_time_days = lead_time_days || 0;
      item.is_active = is_active !== undefined ? is_active : true;

      await itemRepository.save(item);

      return res.status(201).json(item);
    } catch (error) {
      console.error("Error in createItem:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Update item
  static async updateItem(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { 
        item_code, 
        name, 
        description, 
        type, 
        category_id, 
        uom_id, 
        default_supplier_id,
        min_stock_level,
        reorder_point,
        lead_time_days,
        is_active
      } = req.body;

      const itemRepository = AppDataSource.getRepository(Item);
      const item = await itemRepository.findOne({ where: { id: parseInt(id) } });

      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      // Check if item code already exists in the division (if changing)
      if (item_code && item_code !== item.item_code) {
        const existingItem = await itemRepository.findOne({ 
          where: { item_code, division_id: item.division_id } 
        });

        if (existingItem && existingItem.id !== parseInt(id)) {
          return res.status(400).json({ message: "Item code already exists in this division" });
        }
      }

      // Validate category if changing
      if (category_id && category_id !== item.category_id) {
        const categoryRepository = AppDataSource.getRepository(ItemCategory);
        const category = await categoryRepository.findOne({ where: { id: category_id } });
        if (!category) {
          return res.status(404).json({ message: "Category not found" });
        }
      }

      // Validate UOM if changing
      if (uom_id && uom_id !== item.uom_id) {
        const uomRepository = AppDataSource.getRepository(UnitOfMeasurement);
        const uom = await uomRepository.findOne({ where: { id: uom_id } });
        if (!uom) {
          return res.status(404).json({ message: "Unit of measurement not found" });
        }
      }

      // Validate supplier if changing
      if (default_supplier_id && default_supplier_id !== item.default_supplier_id) {
        const supplierRepository = AppDataSource.getRepository(Supplier);
        const supplier = await supplierRepository.findOne({ where: { id: default_supplier_id } });
        if (!supplier) {
          return res.status(404).json({ message: "Supplier not found" });
        }
      }

      // Update item fields
      if (item_code) item.item_code = item_code;
      if (name) item.name = name;
      if (description !== undefined) item.description = description;
      if (type) item.type = type;
      if (category_id) item.category_id = category_id;
      if (uom_id) item.uom_id = uom_id;
      if (default_supplier_id !== undefined) item.default_supplier_id = default_supplier_id;
      if (min_stock_level !== undefined) item.min_stock_level = min_stock_level;
      if (reorder_point !== undefined) item.reorder_point = reorder_point;
      if (lead_time_days !== undefined) item.lead_time_days = lead_time_days;
      if (is_active !== undefined) item.is_active = is_active;

      await itemRepository.save(item);

      return res.status(200).json(item);
    } catch (error) {
      console.error("Error in updateItem:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Delete item
  static async deleteItem(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const itemRepository = AppDataSource.getRepository(Item);
      const item = await itemRepository.findOne({ where: { id: parseInt(id) } });

      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      await itemRepository.remove(item);

      return res.status(200).json({ message: "Item deleted successfully" });
    } catch (error) {
      console.error("Error in deleteItem:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Get items by type
  static async getItemsByType(req: Request, res: Response) {
    try {
      const { type } = req.params;
      const { division_id } = req.query;
      
      const itemRepository = AppDataSource.getRepository(Item);
      let queryBuilder = itemRepository.createQueryBuilder("item")
        .leftJoinAndSelect("item.category", "category")
        .leftJoinAndSelect("item.uom", "uom")
        .where("item.type = :type", { type });
      
      // Filter by division if provided
      if (division_id) {
        queryBuilder = queryBuilder.andWhere("item.division_id = :division_id", { division_id });
      }
      
      const items = await queryBuilder.getMany();

      return res.status(200).json(items);
    } catch (error) {
      console.error("Error in getItemsByType:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
