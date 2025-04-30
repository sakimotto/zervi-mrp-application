import { LotTrackingRepository } from "../repositories/lot-tracking.repository";
import { ItemRepository } from "../repositories/item.repository";
import { LotTracking } from "../models/inventory";

/**
 * Lot Tracking Service
 * 
 * Provides business logic for batch/lot management operations.
 * Handles batch creation, splitting, and tracking.
 */
export class LotTrackingService {
  private lotRepository: LotTrackingRepository;
  private itemRepository: ItemRepository;

  constructor() {
    this.lotRepository = new LotTrackingRepository();
    this.itemRepository = new ItemRepository();
  }

  /**
   * Get all batches/lots with optional filtering
   * @param filters Optional filters (itemId, status, etc.)
   * @returns Array of batches/lots
   */
  async getAllLots(filters?: {
    itemId?: number;
    status?: string;
    expirationBefore?: Date;
    expirationAfter?: Date;
  }): Promise<LotTracking[]> {
    return this.lotRepository.findAll(filters);
  }

  /**
   * Get a batch/lot by ID
   * @param id Batch/lot ID
   * @returns Batch/lot object or null if not found
   */
  async getLotById(id: number): Promise<LotTracking | null> {
    return this.lotRepository.findById(id);
  }

  /**
   * Get all batches/lots for a specific item
   * @param itemId Item ID
   * @returns Array of batches/lots for the item
   */
  async getLotsByItem(itemId: number): Promise<LotTracking[]> {
    // Validate that the item exists and supports batch tracking
    const item = await this.itemRepository.findById(itemId);
    if (!item) {
      throw new Error(`Item with ID ${itemId} not found`);
    }
    
    if (!item.trackBatches) {
      throw new Error(`Item ${item.name} does not support batch tracking`);
    }
    
    return this.lotRepository.findByItem(itemId);
  }

  /**
   * Create a new batch/lot
   * @param lotData Batch/lot data
   * @returns Created batch/lot
   */
  async createLot(lotData: Partial<LotTracking>): Promise<LotTracking> {
    // Validate that the item exists and supports batch tracking
    if (lotData.item) {
      const itemId = typeof lotData.item === 'number' ? lotData.item : (lotData.item as any).id;
      const item = await this.itemRepository.findById(itemId);
      
      if (!item) {
        throw new Error(`Item with ID ${itemId} not found`);
      }
      
      if (!item.trackBatches) {
        throw new Error(`Item ${item.name} does not support batch tracking`);
      }
    }
    
    // Generate a lot number if not provided
    if (!lotData.lotNumber) {
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      lotData.lotNumber = `LOT-${dateStr}-${randomSuffix}`;
    }
    
    // Set default values if not provided
    if (!lotData.receivedDate) {
      lotData.receivedDate = new Date();
    }
    
    if (!lotData.qualityStatus) {
      lotData.qualityStatus = 'pending';
    }
    
    return this.lotRepository.create(lotData);
  }

  /**
   * Update an existing batch/lot
   * @param id Batch/lot ID
   * @param lotData Updated batch/lot data
   * @returns Updated batch/lot or null if not found
   */
  async updateLot(id: number, lotData: Partial<LotTracking>): Promise<LotTracking | null> {
    // Check if lot exists
    const existingLot = await this.lotRepository.findById(id);
    if (!existingLot) {
      return null;
    }
    
    return this.lotRepository.update(id, lotData);
  }

  /**
   * Delete a batch/lot
   * @param id Batch/lot ID
   * @returns True if successfully deleted
   */
  async deleteLot(id: number): Promise<boolean> {
    return this.lotRepository.delete(id);
  }

  /**
   * Split a batch/lot into two separate batches
   * @param id Original batch ID
   * @param splitQuantity Quantity to split off to new batch
   * @param newLotNumber Optional new lot number (generated if not provided)
   * @returns Object containing both original and new batch
   */
  async splitLot(
    id: number,
    splitQuantity: number,
    newLotNumber?: string
  ): Promise<{ original: LotTracking | null; split: LotTracking | null }> {
    // Check if lot exists
    const existingLot = await this.lotRepository.findById(id);
    if (!existingLot) {
      throw new Error(`Batch with ID ${id} not found`);
    }
    
    // Check if item supports batch splitting
    if (existingLot.item) {
      const item = await this.itemRepository.findById(existingLot.item.id);
      if (!item || !item.allowSplit) {
        throw new Error(`Item ${existingLot.item.name || 'unknown'} does not support batch splitting`);
      }
    }
    
    // Generate a new lot number if not provided
    if (!newLotNumber) {
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const baseLotNumber = existingLot.lotNumber.split('-')[0] || 'LOT';
      const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      newLotNumber = `${baseLotNumber}-${dateStr}-${randomSuffix}`;
    }
    
    return this.lotRepository.splitBatch(id, splitQuantity, newLotNumber);
  }

  /**
   * Get all batches that are expiring soon
   * @param daysUntilExpiration Days until expiration (default: 30)
   * @returns Array of expiring batches
   */
  async getExpiringLots(daysUntilExpiration: number = 30): Promise<LotTracking[]> {
    return this.lotRepository.findExpiringBatches(daysUntilExpiration);
  }

  /**
   * Update the quality status of a batch/lot
   * @param id Batch/lot ID
   * @param status New quality status ('pending', 'approved', 'rejected')
   * @returns Updated batch/lot or null if not found
   */
  async updateQualityStatus(id: number, status: string): Promise<LotTracking | null> {
    const validStatuses = ['pending', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid quality status: ${status}. Must be one of: ${validStatuses.join(', ')}`);
    }
    
    return this.lotRepository.update(id, { qualityStatus: status });
  }
}
