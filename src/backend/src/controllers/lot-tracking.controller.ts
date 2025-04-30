import { Request, Response } from "express";
import { LotTrackingService } from "../services/lot-tracking.service";

/**
 * Lot Tracking Controller
 * 
 * Handles HTTP requests for batch/lot management operations.
 * Provides RESTful API endpoints for frontend integration.
 */
export class LotTrackingController {
  private lotService: LotTrackingService;

  constructor() {
    this.lotService = new LotTrackingService();
  }

  /**
   * Get all batches/lots with optional filtering
   * @param req Express request
   * @param res Express response
   */
  async getAllLots(req: Request, res: Response): Promise<void> {
    try {
      const filters: any = {};
      
      if (req.query.itemId) {
        filters.itemId = parseInt(req.query.itemId as string);
      }
      
      if (req.query.status) {
        filters.status = req.query.status;
      }
      
      if (req.query.expirationBefore) {
        filters.expirationBefore = new Date(req.query.expirationBefore as string);
      }
      
      if (req.query.expirationAfter) {
        filters.expirationAfter = new Date(req.query.expirationAfter as string);
      }
      
      const lots = await this.lotService.getAllLots(filters);
      res.status(200).json(lots);
    } catch (error) {
      res.status(500).json({ 
        message: "Error retrieving batches", 
        error: (error as Error).message 
      });
    }
  }

  /**
   * Get a batch/lot by ID
   * @param req Express request
   * @param res Express response
   */
  async getLotById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const lot = await this.lotService.getLotById(id);
      
      if (!lot) {
        res.status(404).json({ message: `Batch with ID ${id} not found` });
        return;
      }
      
      res.status(200).json(lot);
    } catch (error) {
      res.status(500).json({ 
        message: "Error retrieving batch", 
        error: (error as Error).message 
      });
    }
  }

  /**
   * Get all batches/lots for a specific item
   * @param req Express request
   * @param res Express response
   */
  async getLotsByItem(req: Request, res: Response): Promise<void> {
    try {
      const itemId = parseInt(req.params.itemId);
      const lots = await this.lotService.getLotsByItem(itemId);
      res.status(200).json(lots);
    } catch (error) {
      res.status(500).json({ 
        message: "Error retrieving batches for item", 
        error: (error as Error).message 
      });
    }
  }

  /**
   * Create a new batch/lot
   * @param req Express request
   * @param res Express response
   */
  async createLot(req: Request, res: Response): Promise<void> {
    try {
      const newLot = await this.lotService.createLot(req.body);
      res.status(201).json(newLot);
    } catch (error) {
      res.status(400).json({ 
        message: "Error creating batch", 
        error: (error as Error).message 
      });
    }
  }

  /**
   * Update an existing batch/lot
   * @param req Express request
   * @param res Express response
   */
  async updateLot(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const updatedLot = await this.lotService.updateLot(id, req.body);
      
      if (!updatedLot) {
        res.status(404).json({ message: `Batch with ID ${id} not found` });
        return;
      }
      
      res.status(200).json(updatedLot);
    } catch (error) {
      res.status(400).json({ 
        message: "Error updating batch", 
        error: (error as Error).message 
      });
    }
  }

  /**
   * Delete a batch/lot
   * @param req Express request
   * @param res Express response
   */
  async deleteLot(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const deleted = await this.lotService.deleteLot(id);
      
      if (!deleted) {
        res.status(404).json({ message: `Batch with ID ${id} not found` });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ 
        message: "Error deleting batch", 
        error: (error as Error).message 
      });
    }
  }

  /**
   * Split a batch/lot into two separate batches
   * @param req Express request
   * @param res Express response
   */
  async splitLot(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const { splitQuantity, newLotNumber } = req.body;
      
      if (!splitQuantity || typeof splitQuantity !== 'number' || splitQuantity <= 0) {
        res.status(400).json({ message: "Split quantity must be a positive number" });
        return;
      }
      
      const result = await this.lotService.splitLot(id, splitQuantity, newLotNumber);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ 
        message: "Error splitting batch", 
        error: (error as Error).message 
      });
    }
  }

  /**
   * Get all batches that are expiring soon
   * @param req Express request
   * @param res Express response
   */
  async getExpiringLots(req: Request, res: Response): Promise<void> {
    try {
      const daysUntilExpiration = req.query.days ? parseInt(req.query.days as string) : 30;
      const lots = await this.lotService.getExpiringLots(daysUntilExpiration);
      res.status(200).json(lots);
    } catch (error) {
      res.status(500).json({ 
        message: "Error retrieving expiring batches", 
        error: (error as Error).message 
      });
    }
  }

  /**
   * Update the quality status of a batch/lot
   * @param req Express request
   * @param res Express response
   */
  async updateQualityStatus(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status) {
        res.status(400).json({ message: "Quality status is required" });
        return;
      }
      
      const updatedLot = await this.lotService.updateQualityStatus(id, status);
      
      if (!updatedLot) {
        res.status(404).json({ message: `Batch with ID ${id} not found` });
        return;
      }
      
      res.status(200).json(updatedLot);
    } catch (error) {
      res.status(400).json({ 
        message: "Error updating quality status", 
        error: (error as Error).message 
      });
    }
  }
}
