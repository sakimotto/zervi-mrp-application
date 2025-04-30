import { AppDataSource } from "../config/database";
import { LotTracking, Item } from "../models/inventory";
import { Repository } from "typeorm";

/**
 * Lot Tracking Repository
 * 
 * Handles database operations for batch/lot tracking.
 * Provides methods for managing batches, including specialized operations 
 * for batch splitting and fabric roll management.
 */
export class LotTrackingRepository {
  private repository: Repository<LotTracking>;

  constructor() {
    this.repository = AppDataSource.getRepository(LotTracking);
  }

  /**
   * Find all batches/lots with optional filtering
   * @param options Optional filter options
   * @returns Array of batches/lots
   */
  async findAll(options?: {
    itemId?: number;
    status?: string;
    expirationBefore?: Date;
    expirationAfter?: Date;
  }): Promise<LotTracking[]> {
    const queryBuilder = this.repository.createQueryBuilder("lot")
      .leftJoinAndSelect("lot.item", "item")
      .leftJoinAndSelect("lot.division", "division");

    if (options) {
      if (options.itemId) {
        queryBuilder.andWhere("lot.item.id = :itemId", { itemId: options.itemId });
      }
      if (options.status) {
        queryBuilder.andWhere("lot.status = :status", { status: options.status });
      }
      if (options.expirationBefore) {
        queryBuilder.andWhere("lot.expirationDate <= :expirationBefore", { expirationBefore: options.expirationBefore });
      }
      if (options.expirationAfter) {
        queryBuilder.andWhere("lot.expirationDate >= :expirationAfter", { expirationAfter: options.expirationAfter });
      }
    }

    return queryBuilder.getMany();
  }

  /**
   * Find batch/lot by ID with all relations
   * @param id Batch/lot ID
   * @returns Batch/lot with related data
   */
  async findById(id: number): Promise<LotTracking | null> {
    return this.repository.findOne({
      where: { id },
      relations: ["item", "division", "inventories", "serialNumbers", "fabricRolls"]
    });
  }

  /**
   * Find batches/lots by item
   * @param itemId Item ID
   * @returns Array of batches/lots for the item
   */
  async findByItem(itemId: number): Promise<LotTracking[]> {
    return this.findAll({ itemId });
  }

  /**
   * Create a new batch/lot
   * @param lotData Batch/lot data
   * @returns Created batch/lot
   */
  async create(lotData: Partial<LotTracking>): Promise<LotTracking> {
    const lot = this.repository.create(lotData);
    // Set remaining quantity to initial quantity if not provided
    if (lot.quantity && lot.remainingQuantity === undefined) {
      lot.remainingQuantity = lot.quantity;
    }
    return this.repository.save(lot);
  }

  /**
   * Update an existing batch/lot
   * @param id Batch/lot ID
   * @param lotData Updated batch/lot data
   * @returns Updated batch/lot
   */
  async update(id: number, lotData: Partial<LotTracking>): Promise<LotTracking | null> {
    await this.repository.update(id, lotData);
    return this.findById(id);
  }

  /**
   * Split a batch/lot into two separate batches
   * @param id Original batch ID
   * @param splitQuantity Quantity to split off to new batch
   * @param newLotNumber Lot number for the new batch
   * @returns Object containing both original and new batch
   */
  async splitBatch(
    id: number,
    splitQuantity: number,
    newLotNumber: string
  ): Promise<{ original: LotTracking | null; split: LotTracking | null }> {
    // Get the original batch
    const originalBatch = await this.findById(id);
    if (!originalBatch) {
      throw new Error(`Batch with ID ${id} not found`);
    }

    // Validate split quantity
    if (splitQuantity <= 0 || splitQuantity >= originalBatch.remainingQuantity) {
      throw new Error(`Invalid split quantity. Must be between 0 and ${originalBatch.remainingQuantity}`);
    }

    // Create the new split batch
    const newBatch = this.repository.create({
      lotNumber: newLotNumber,
      item: originalBatch.item,
      receivedDate: originalBatch.receivedDate,
      expirationDate: originalBatch.expirationDate,
      manufacturingDate: originalBatch.manufacturingDate,
      qualityStatus: originalBatch.qualityStatus,
      quantity: splitQuantity,
      remainingQuantity: splitQuantity,
      status: originalBatch.status,
      parentLotId: originalBatch.id,
      certificationInfo: originalBatch.certificationInfo,
      notes: `Split from batch ${originalBatch.lotNumber}`,
      division: originalBatch.division
    });

    // Update the original batch
    originalBatch.remainingQuantity -= splitQuantity;
    
    // Save both batches in a transaction
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      await queryRunner.manager.save(originalBatch);
      const splitBatchResult = await queryRunner.manager.save(newBatch);
      await queryRunner.commitTransaction();
      
      return {
        original: originalBatch,
        split: splitBatchResult
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Find batches that have expired or are about to expire
   * @param daysUntilExpiration Days until expiration (default: 30)
   * @returns Array of expiring batches
   */
  async findExpiringBatches(daysUntilExpiration: number = 30): Promise<LotTracking[]> {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + daysUntilExpiration);
    
    return this.findAll({
      expirationBefore: expirationDate,
      expirationAfter: new Date()
    });
  }

  /**
   * Find batches with specific quality status
   * @param status Quality status ('pending', 'approved', 'rejected')
   * @returns Array of batches with the specified status
   */
  async findByQualityStatus(status: string): Promise<LotTracking[]> {
    const queryBuilder = this.repository.createQueryBuilder("lot")
      .leftJoinAndSelect("lot.item", "item")
      .leftJoinAndSelect("lot.division", "division")
      .where("lot.qualityStatus = :status", { status });
      
    return queryBuilder.getMany();
  }

  /**
   * Delete a batch/lot
   * @param id Batch/lot ID
   * @returns True if deleted
   */
  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}
