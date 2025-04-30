import { Request, Response } from "express";
import { FabricRollService } from "../services/fabric-roll.service";

/**
 * Fabric Roll Controller
 * 
 * Handles HTTP requests for specialized fabric roll operations.
 * Provides RESTful API endpoints for frontend integration.
 */
export class FabricRollController {
  private fabricRollService: FabricRollService;

  constructor() {
    this.fabricRollService = new FabricRollService();
  }

  /**
   * Get all fabric rolls with optional filtering
   * @param req Express request
   * @param res Express response
   */
  async getAllRolls(req: Request, res: Response): Promise<void> {
    try {
      const filters: any = {};
      
      if (req.query.lotId) {
        filters.lotId = parseInt(req.query.lotId as string);
      }
      
      if (req.query.status) {
        filters.status = req.query.status;
      }
      
      if (req.query.location) {
        filters.location = req.query.location;
      }
      
      const rolls = await this.fabricRollService.getAllRolls(filters);
      res.status(200).json(rolls);
    } catch (error) {
      res.status(500).json({ 
        message: "Error retrieving fabric rolls", 
        error: (error as Error).message 
      });
    }
  }

  /**
   * Get a fabric roll by ID
   * @param req Express request
   * @param res Express response
   */
  async getRollById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const roll = await this.fabricRollService.getRollById(id);
      
      if (!roll) {
        res.status(404).json({ message: `Fabric roll with ID ${id} not found` });
        return;
      }
      
      res.status(200).json(roll);
    } catch (error) {
      res.status(500).json({ 
        message: "Error retrieving fabric roll", 
        error: (error as Error).message 
      });
    }
  }

  /**
   * Get all fabric rolls for a specific batch/lot
   * @param req Express request
   * @param res Express response
   */
  async getRollsByLot(req: Request, res: Response): Promise<void> {
    try {
      const lotId = parseInt(req.params.lotId);
      const rolls = await this.fabricRollService.getRollsByLot(lotId);
      res.status(200).json(rolls);
    } catch (error) {
      res.status(500).json({ 
        message: "Error retrieving fabric rolls for batch", 
        error: (error as Error).message 
      });
    }
  }

  /**
   * Create a new fabric roll
   * @param req Express request
   * @param res Express response
   */
  async createRoll(req: Request, res: Response): Promise<void> {
    try {
      const generateSerial = req.body.generateSerial !== false;
      delete req.body.generateSerial; // Remove from payload before passing to service
      
      const newRoll = await this.fabricRollService.createRoll(req.body, generateSerial);
      res.status(201).json(newRoll);
    } catch (error) {
      res.status(400).json({ 
        message: "Error creating fabric roll", 
        error: (error as Error).message 
      });
    }
  }

  /**
   * Update an existing fabric roll
   * @param req Express request
   * @param res Express response
   */
  async updateRoll(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const updatedRoll = await this.fabricRollService.updateRoll(id, req.body);
      
      if (!updatedRoll) {
        res.status(404).json({ message: `Fabric roll with ID ${id} not found` });
        return;
      }
      
      res.status(200).json(updatedRoll);
    } catch (error) {
      res.status(400).json({ 
        message: "Error updating fabric roll", 
        error: (error as Error).message 
      });
    }
  }

  /**
   * Split a fabric roll into two separate rolls
   * @param req Express request
   * @param res Express response
   */
  async splitRoll(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const { splitQuantity } = req.body;
      
      if (!splitQuantity || typeof splitQuantity !== 'number' || splitQuantity <= 0) {
        res.status(400).json({ message: "Split quantity must be a positive number" });
        return;
      }
      
      const result = await this.fabricRollService.splitRoll(id, splitQuantity);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ 
        message: "Error splitting fabric roll", 
        error: (error as Error).message 
      });
    }
  }

  /**
   * Get all child rolls created from splits of a parent roll
   * @param req Express request
   * @param res Express response
   */
  async getChildRolls(req: Request, res: Response): Promise<void> {
    try {
      const parentId = parseInt(req.params.parentId);
      const childRolls = await this.fabricRollService.getChildRolls(parentId);
      res.status(200).json(childRolls);
    } catch (error) {
      res.status(500).json({ 
        message: "Error retrieving child fabric rolls", 
        error: (error as Error).message 
      });
    }
  }

  /**
   * Delete a fabric roll
   * @param req Express request
   * @param res Express response
   */
  async deleteRoll(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const deleted = await this.fabricRollService.deleteRoll(id);
      
      if (!deleted) {
        res.status(404).json({ message: `Fabric roll with ID ${id} not found` });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ 
        message: "Error deleting fabric roll", 
        error: (error as Error).message 
      });
    }
  }
}
