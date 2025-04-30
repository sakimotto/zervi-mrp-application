import { AppDataSource } from "../config/database";
import { FabricRoll, LotTracking, SerialNumber } from "../models/inventory";
import { Repository } from "typeorm";

/**
 * Fabric Roll Repository
 * 
 * Handles database operations for specialized fabric roll management.
 * Provides methods for tracking fabric rolls and supporting split operations.
 */
export class FabricRollRepository {
  private repository: Repository<FabricRoll>;
  private serialRepository: Repository<SerialNumber>;

  constructor() {
    this.repository = AppDataSource.getRepository(FabricRoll);
    this.serialRepository = AppDataSource.getRepository(SerialNumber);
  }

  /**
   * Find all fabric rolls with optional filtering
   * @param options Optional filter options
   * @returns Array of fabric rolls
   */
  async findAll(options?: {
    lotId?: number;
    status?: string;
    location?: string;
  }): Promise<FabricRoll[]> {
    const queryBuilder = this.repository.createQueryBuilder("roll")
      .leftJoinAndSelect("roll.lot", "lot")
      .leftJoinAndSelect("roll.serialNumber", "serialNumber")
      .leftJoinAndSelect("lot.item", "item");

    if (options) {
      if (options.lotId) {
        queryBuilder.andWhere("roll.lot.id = :lotId", { lotId: options.lotId });
      }
      if (options.status) {
        queryBuilder.andWhere("roll.status = :status", { status: options.status });
      }
      if (options.location) {
        queryBuilder.andWhere("roll.location LIKE :location", { location: `%${options.location}%` });
      }
    }

    return queryBuilder.getMany();
  }

  /**
   * Find fabric roll by ID with all relations
   * @param id Fabric roll ID
   * @returns Fabric roll with related data
   */
  async findById(id: number): Promise<FabricRoll | null> {
    return this.repository.findOne({
      where: { id },
      relations: ["lot", "lot.item", "serialNumber", "parentRoll"]
    });
  }

  /**
   * Find fabric rolls by lot/batch
   * @param lotId Lot/batch ID
   * @returns Array of fabric rolls for the lot
   */
  async findByLot(lotId: number): Promise<FabricRoll[]> {
    return this.findAll({ lotId });
  }

  /**
   * Create a new fabric roll
   * @param rollData Fabric roll data
   * @param generateSerial Whether to generate a serial number (default: true)
   * @returns Created fabric roll
   */
  async create(rollData: Partial<FabricRoll>, generateSerial: boolean = true): Promise<FabricRoll> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      let serialNumber: SerialNumber | null = null;
      
      // Generate serial number if requested
      if (generateSerial && rollData.lot) {
        const lot = await queryRunner.manager.findOne(LotTracking, {
          where: { id: (rollData.lot as any).id || rollData.lot },
          relations: ["item"]
        });
        
        if (lot) {
          // Create a serial number for this roll
          const newSerial = this.serialRepository.create({
            serialNumber: `FR-${lot.lotNumber}-${new Date().getTime()}`,
            item: lot.item,
            lot: lot,
            status: 'available',
            location: rollData.location,
            notes: rollData.notes
          });
          
          serialNumber = await queryRunner.manager.save(newSerial);
          rollData.serialNumber = serialNumber;
        }
      }
      
      // Create the fabric roll
      const roll = this.repository.create(rollData);
      const savedRoll = await queryRunner.manager.save(roll);
      
      // Link the roll to the serial number
      if (serialNumber) {
        serialNumber.fabricRoll = savedRoll;
        await queryRunner.manager.save(serialNumber);
      }
      
      await queryRunner.commitTransaction();
      return this.findById(savedRoll.id) as Promise<FabricRoll>;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Update an existing fabric roll
   * @param id Fabric roll ID
   * @param rollData Updated fabric roll data
   * @returns Updated fabric roll
   */
  async update(id: number, rollData: Partial<FabricRoll>): Promise<FabricRoll | null> {
    await this.repository.update(id, rollData);
    return this.findById(id);
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
    // Get the original roll
    const originalRoll = await this.findById(id);
    if (!originalRoll) {
      throw new Error(`Fabric roll with ID ${id} not found`);
    }

    // Validate split quantity
    if (splitQuantity <= 0 || splitQuantity >= originalRoll.quantity) {
      throw new Error(`Invalid split quantity. Must be between 0 and ${originalRoll.quantity}`);
    }

    // Start a transaction for the split operation
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      // Create the new split roll
      const newRoll = this.repository.create({
        lot: originalRoll.lot,
        quantity: splitQuantity,
        width: originalRoll.width,
        status: originalRoll.status,
        location: originalRoll.location,
        notes: `Split from roll ID: ${originalRoll.id}`,
        parentRoll: originalRoll
      });
      
      // Update the original roll quantity
      originalRoll.quantity -= splitQuantity;
      originalRoll.notes = originalRoll.notes ? 
        `${originalRoll.notes}\nSplit ${splitQuantity} to new roll on ${new Date().toISOString()}` : 
        `Split ${splitQuantity} to new roll on ${new Date().toISOString()}`;
      
      // Save both rolls
      await queryRunner.manager.save(originalRoll);
      const splitRollResult = await queryRunner.manager.save(newRoll);
      
      // Generate a serial number for the new roll if the original had one
      if (originalRoll.serialNumber) {
        const newSerial = this.serialRepository.create({
          serialNumber: `FR-SPLIT-${originalRoll.serialNumber.serialNumber}-${new Date().getTime()}`,
          item: originalRoll.serialNumber.item,
          lot: originalRoll.lot,
          status: 'available',
          location: newRoll.location,
          notes: `Split from roll with serial: ${originalRoll.serialNumber.serialNumber}`
        });
        
        const savedSerial = await queryRunner.manager.save(newSerial);
        
        // Link the serial to the roll
        splitRollResult.serialNumber = savedSerial;
        savedSerial.fabricRoll = splitRollResult;
        
        await queryRunner.manager.save(splitRollResult);
        await queryRunner.manager.save(savedSerial);
      }
      
      await queryRunner.commitTransaction();
      
      return {
        original: await this.findById(originalRoll.id),
        split: await this.findById(splitRollResult.id)
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Find rolls by parent roll (split history)
   * @param parentId Parent roll ID
   * @returns Array of child rolls from splits
   */
  async findChildRolls(parentId: number): Promise<FabricRoll[]> {
    return this.repository.find({
      where: { parentRoll: { id: parentId } },
      relations: ["lot", "serialNumber", "lot.item"]
    });
  }

  /**
   * Delete a fabric roll
   * @param id Fabric roll ID
   * @returns True if deleted
   */
  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}
