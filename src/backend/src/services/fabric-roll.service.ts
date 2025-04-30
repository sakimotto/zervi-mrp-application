import { FabricRollRepository } from "../repositories/fabric-roll.repository";
import { LotTrackingRepository } from "../repositories/lot-tracking.repository";
import { ItemRepository } from "../repositories/item.repository";
import { FabricRoll } from "../models/inventory";

/**
 * Fabric Roll Service
 * 
 * Provides business logic for specialized fabric roll management.
 * Handles operations specific to fabric rolls including splitting.
 */
export class FabricRollService {
  private fabricRollRepository: FabricRollRepository;
  private lotRepository: LotTrackingRepository;
  private itemRepository: ItemRepository;

  constructor() {
    this.fabricRollRepository = new FabricRollRepository();
    this.lotRepository = new LotTrackingRepository();
    this.itemRepository = new ItemRepository();
  }

  /**
   * Get all fabric rolls with optional filtering
   * @param filters Optional filters (lotId, status, location)
   * @returns Array of fabric rolls
   */
  async getAllRolls(filters?: {
    lotId?: number;
    status?: string;
    location?: string;
  }): Promise<FabricRoll[]> {
    return this.fabricRollRepository.findAll(filters);
  }

  /**
   * Get a fabric roll by ID
   * @param id Fabric roll ID
   * @returns Fabric roll object or null if not found
   */
  async getRollById(id: number): Promise<FabricRoll | null> {
    return this.fabricRollRepository.findById(id);
  }

  /**
   * Get all fabric rolls for a specific lot/batch
   * @param lotId Lot/batch ID
   * @returns Array of fabric rolls for the lot
   */
  async getRollsByLot(lotId: number): Promise<FabricRoll[]> {
    // Validate that the lot exists
    const lot = await this.lotRepository.findById(lotId);
    if (!lot) {
      throw new Error(`Batch with ID ${lotId} not found`);
    }
    
    // Ensure item supports fabric roll tracking
    if (lot.item) {
      const item = await this.itemRepository.findById(lot.item.id);
      if (!item || !item.trackBatches) {
        throw new Error(`Item ${lot.item.name || 'unknown'} does not support batch tracking`);
      }
    }
    
    return this.fabricRollRepository.findByLot(lotId);
  }

  /**
   * Create a new fabric roll
   * @param rollData Fabric roll data
   * @param generateSerial Whether to generate a serial number
   * @returns Created fabric roll
   */
  async createRoll(rollData: Partial<FabricRoll>, generateSerial: boolean = true): Promise<FabricRoll> {
    // Validate that the lot exists
    if (rollData.lot) {
      const lotId = typeof rollData.lot === 'number' ? rollData.lot : (rollData.lot as any).id;
      const lot = await this.lotRepository.findById(lotId);
      
      if (!lot) {
        throw new Error(`Batch with ID ${lotId} not found`);
      }
      
      // Check if the lot has sufficient quantity for the roll
      if (lot.remainingQuantity < (rollData.quantity || 0)) {
        throw new Error(`Insufficient quantity in batch. Available: ${lot.remainingQuantity}, Requested: ${rollData.quantity}`);
      }
      
      // Update lot remaining quantity after roll creation
      const updatedRemainingQty = lot.remainingQuantity - (rollData.quantity || 0);
      await this.lotRepository.update(lotId, { remainingQuantity: updatedRemainingQty });
    }
    
    return this.fabricRollRepository.create(rollData, generateSerial);
  }

  /**
   * Update an existing fabric roll
   * @param id Fabric roll ID
   * @param rollData Updated fabric roll data
   * @returns Updated fabric roll or null if not found
   */
  async updateRoll(id: number, rollData: Partial<FabricRoll>): Promise<FabricRoll | null> {
    // Check if roll exists
    const existingRoll = await this.fabricRollRepository.findById(id);
    if (!existingRoll) {
      return null;
    }
    
    // If quantity is being changed, update the lot remaining quantity accordingly
    if (rollData.quantity !== undefined && rollData.quantity !== existingRoll.quantity && existingRoll.lot) {
      const lot = await this.lotRepository.findById(existingRoll.lot.id);
      if (lot) {
        // Calculate the difference and update lot remaining quantity
        const quantityDifference = existingRoll.quantity - rollData.quantity;
        const updatedRemainingQty = lot.remainingQuantity + quantityDifference;
        
        // Ensure we don't go below zero
        if (updatedRemainingQty < 0) {
          throw new Error(`Cannot increase roll quantity beyond lot available quantity`);
        }
        
        await this.lotRepository.update(lot.id, { remainingQuantity: updatedRemainingQty });
      }
    }
    
    return this.fabricRollRepository.update(id, rollData);
  }

  /**
   * Split a fabric roll into two separate rolls
   * @param id Original roll ID
   * @param splitQuantity Quantity to split off to new roll
   * @returns Object containing both original and new roll
   */
  async splitRoll(
    id: number,
    splitQuantity: number
  ): Promise<{ original: FabricRoll | null; split: FabricRoll | null }> {
    // Check if roll exists
    const existingRoll = await this.fabricRollRepository.findById(id);
    if (!existingRoll) {
      throw new Error(`Fabric roll with ID ${id} not found`);
    }
    
    // Check if the item supports splitting
    if (existingRoll.lot && existingRoll.lot.item) {
      const item = await this.itemRepository.findById(existingRoll.lot.item.id);
      if (!item || !item.allowSplit) {
        throw new Error(`Item ${existingRoll.lot.item.name || 'unknown'} does not support splitting`);
      }
    }
    
    // Validate split quantity
    if (splitQuantity <= 0 || splitQuantity >= existingRoll.quantity) {
      throw new Error(`Invalid split quantity. Must be between 0 and ${existingRoll.quantity}`);
    }
    
    return this.fabricRollRepository.splitRoll(id, splitQuantity);
  }

  /**
   * Get all child rolls created from splits of a parent roll
   * @param parentId Parent roll ID
   * @returns Array of child rolls
   */
  async getChildRolls(parentId: number): Promise<FabricRoll[]> {
    return this.fabricRollRepository.findChildRolls(parentId);
  }

  /**
   * Delete a fabric roll
   * @param id Fabric roll ID
   * @returns True if successfully deleted
   */
  async deleteRoll(id: number): Promise<boolean> {
    // Check if roll exists
    const existingRoll = await this.fabricRollRepository.findById(id);
    if (!existingRoll) {
      return false;
    }
    
    // If deleting a roll, add its quantity back to the lot
    if (existingRoll.lot) {
      const lot = await this.lotRepository.findById(existingRoll.lot.id);
      if (lot) {
        const updatedRemainingQty = lot.remainingQuantity + existingRoll.quantity;
        await this.lotRepository.update(lot.id, { remainingQuantity: updatedRemainingQty });
      }
    }
    
    return this.fabricRollRepository.delete(id);
  }
}
