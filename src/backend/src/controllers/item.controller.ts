import { Request, Response } from "express";
import { ItemService } from "../services/item.service";

/**
 * Item Controller
 * 
 * Handles HTTP requests for inventory item operations.
 * Provides RESTful API endpoints for frontend integration.
 */
export class ItemController {
  private itemService: ItemService;

  constructor() {
    this.itemService = new ItemService();
  }

  /**
   * Get all items with optional filtering
   * @param req Express request
   * @param res Express response
   */
  async getAllItems(req: Request, res: Response): Promise<void> {
    try {
      const filters = {
        itemType: req.query.itemType as string,
        isActive: req.query.isActive === 'true',
        category: req.query.category ? parseInt(req.query.category as string) : undefined,
        trackBatches: req.query.trackBatches === 'true',
        trackSerials: req.query.trackSerials === 'true'
      };
      
      const items = await this.itemService.getAllItems(filters);
      res.status(200).json(items);
    } catch (error) {
      res.status(500).json({ 
        message: "Error retrieving items", 
        error: (error as Error).message 
      });
    }
  }

  /**
   * Get item by ID
   * @param req Express request
   * @param res Express response
   */
  async getItemById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const item = await this.itemService.getItemById(id);
      
      if (!item) {
        res.status(404).json({ message: `Item with ID ${id} not found` });
        return;
      }
      
      res.status(200).json(item);
    } catch (error) {
      res.status(500).json({ 
        message: "Error retrieving item", 
        error: (error as Error).message 
      });
    }
  }

  /**
   * Get item by item code
   * @param req Express request
   * @param res Express response
   */
  async getItemByCode(req: Request, res: Response): Promise<void> {
    try {
      const itemCode = req.params.code;
      const item = await this.itemService.getItemByCode(itemCode);
      
      if (!item) {
        res.status(404).json({ message: `Item with code ${itemCode} not found` });
        return;
      }
      
      res.status(200).json(item);
    } catch (error) {
      res.status(500).json({ 
        message: "Error retrieving item", 
        error: (error as Error).message 
      });
    }
  }

  /**
   * Create a new inventory item
   * @param req Express request
   * @param res Express response
   */
  async createItem(req: Request, res: Response): Promise<void> {
    try {
      const newItem = await this.itemService.createItem(req.body);
      res.status(201).json(newItem);
    } catch (error) {
      res.status(400).json({ 
        message: "Error creating item", 
        error: (error as Error).message 
      });
    }
  }

  /**
   * Update an existing item
   * @param req Express request
   * @param res Express response
   */
  async updateItem(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const updatedItem = await this.itemService.updateItem(id, req.body);
      
      if (!updatedItem) {
        res.status(404).json({ message: `Item with ID ${id} not found` });
        return;
      }
      
      res.status(200).json(updatedItem);
    } catch (error) {
      res.status(400).json({ 
        message: "Error updating item", 
        error: (error as Error).message 
      });
    }
  }

  /**
   * Delete an inventory item
   * @param req Express request
   * @param res Express response
   */
  async deleteItem(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const deleted = await this.itemService.deleteItem(id);
      
      if (!deleted) {
        res.status(404).json({ message: `Item with ID ${id} not found` });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ 
        message: "Error deleting item", 
        error: (error as Error).message 
      });
    }
  }

  /**
   * Get all items that support batch tracking
   * @param req Express request
   * @param res Express response
   */
  async getBatchTrackingItems(req: Request, res: Response): Promise<void> {
    try {
      const items = await this.itemService.getBatchTrackingItems();
      res.status(200).json(items);
    } catch (error) {
      res.status(500).json({ 
        message: "Error retrieving batch tracking items", 
        error: (error as Error).message 
      });
    }
  }

  /**
   * Get all items that support serial tracking
   * @param req Express request
   * @param res Express response
   */
  async getSerialTrackingItems(req: Request, res: Response): Promise<void> {
    try {
      const items = await this.itemService.getSerialTrackingItems();
      res.status(200).json(items);
    } catch (error) {
      res.status(500).json({ 
        message: "Error retrieving serial tracking items", 
        error: (error as Error).message 
      });
    }
  }

  /**
   * Get all items that support splitting
   * @param req Express request
   * @param res Express response
   */
  async getSplittableItems(req: Request, res: Response): Promise<void> {
    try {
      const items = await this.itemService.getSplittableItems();
      res.status(200).json(items);
    } catch (error) {
      res.status(500).json({ 
        message: "Error retrieving splittable items", 
        error: (error as Error).message 
      });
    }
  }

  /**
   * Enable batch tracking for an item
   * @param req Express request
   * @param res Express response
   */
  async enableBatchTracking(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const updatedItem = await this.itemService.enableBatchTracking(id);
      
      if (!updatedItem) {
        res.status(404).json({ message: `Item with ID ${id} not found` });
        return;
      }
      
      res.status(200).json(updatedItem);
    } catch (error) {
      res.status(400).json({ 
        message: "Error enabling batch tracking", 
        error: (error as Error).message 
      });
    }
  }

  /**
   * Enable serial number tracking for an item
   * @param req Express request
   * @param res Express response
   */
  async enableSerialTracking(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const updatedItem = await this.itemService.enableSerialTracking(id);
      
      if (!updatedItem) {
        res.status(404).json({ message: `Item with ID ${id} not found` });
        return;
      }
      
      res.status(200).json(updatedItem);
    } catch (error) {
      res.status(400).json({ 
        message: "Error enabling serial tracking", 
        error: (error as Error).message 
      });
    }
  }

  /**
   * Enable split functionality for an item
   * @param req Express request
   * @param res Express response
   */
  async enableSplitFunctionality(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const updatedItem = await this.itemService.enableSplitFunctionality(id);
      
      if (!updatedItem) {
        res.status(404).json({ message: `Item with ID ${id} not found` });
        return;
      }
      
      res.status(200).json(updatedItem);
    } catch (error) {
      res.status(400).json({ 
        message: "Error enabling split functionality", 
        error: (error as Error).message 
      });
    }
  }
}
