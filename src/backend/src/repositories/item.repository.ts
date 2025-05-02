import { AppDataSource } from "../config/database";
import { Item } from "../models/inventory";
import { Repository } from "typeorm";

/**
 * Item Repository
 * 
 * Handles database operations for inventory items.
 * Provides methods for CRUD operations and specialized inventory queries.
 */
export class ItemRepository {
  private repository: Repository<Item>;

  constructor() {
    this.repository = AppDataSource.getRepository(Item);
  }

  /**
   * Find all items with optional filtering
   * @param options Optional filter options
   * @returns Array of items
   */
  async findAll(options?: {
    itemType?: string;
    isActive?: boolean;
    category?: number;
    trackBatches?: boolean;
    trackSerials?: boolean;
  }): Promise<Item[]> {
    const queryBuilder = this.repository.createQueryBuilder("item")
      .leftJoinAndSelect("item.category", "category")
      .leftJoinAndSelect("item.primaryUom", "primaryUom")
      .leftJoinAndSelect("item.division", "division");

    if (options) {
      if (options.itemType) {
        queryBuilder.andWhere("item.itemType = :itemType", { itemType: options.itemType });
      }
      if (options.isActive !== undefined) {
        queryBuilder.andWhere("item.isActive = :isActive", { isActive: options.isActive });
      }
      if (options.category) {
        queryBuilder.andWhere("item.category.id = :categoryId", { categoryId: options.category });
      }
      if (options.trackBatches !== undefined) {
        queryBuilder.andWhere("item.trackBatches = :trackBatches", { trackBatches: options.trackBatches });
      }
      if (options.trackSerials !== undefined) {
        queryBuilder.andWhere("item.trackSerials = :trackSerials", { trackSerials: options.trackSerials });
      }
    }

    return queryBuilder.getMany();
  }

  /**
   * Find item by ID with all relations
   * @param id Item ID
   * @returns Item with related data
   */
  async findById(id: number): Promise<Item | null> {
    return this.repository.findOne({
      where: { id },
      relations: ["category", "primaryUom", "secondaryUom", "division"]
    });
  }

  /**
   * Find item by item code
   * @param itemCode Item code
   * @returns Item with related data
   */
  async findByItemCode(itemCode: string): Promise<Item | null> {
    return this.repository.findOne({
      where: { itemCode },
      relations: ["category", "primaryUom", "secondaryUom", "division"]
    });
  }

  /**
   * Create a new item
   * @param itemData Item data
   * @returns Created item
   */
  async create(itemData: Partial<Item>): Promise<Item> {
    const item = this.repository.create(itemData);
    return this.repository.save(item);
  }

  /**
   * Update an existing item
   * @param id Item ID
   * @param itemData Updated item data
   * @returns Updated item
   */
  async update(id: number, itemData: Partial<Item>): Promise<Item | null> {
    await this.repository.update(id, itemData);
    return this.findById(id);
  }

  /**
   * Delete an item
   * @param id Item ID
   * @returns True if deleted
   */
  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  /**
   * Find items that support batch tracking
   * @returns Array of items with batch tracking enabled
   */
  async findBatchTrackingItems(): Promise<Item[]> {
    return this.findAll({ trackBatches: true });
  }

  /**
   * Find items that support serial number tracking
   * @returns Array of items with serial tracking enabled
   */
  async findSerialTrackingItems(): Promise<Item[]> {
    return this.findAll({ trackSerials: true });
  }

  /**
   * Find fabric items that support splitting
   * @returns Array of items with split functionality enabled
   */
  async findSplittableItems(): Promise<Item[]> {
    const queryBuilder = this.repository.createQueryBuilder("item")
      .leftJoinAndSelect("item.category", "category")
      .leftJoinAndSelect("item.primaryUom", "primaryUom")
      .leftJoinAndSelect("item.division", "division")
      .where("item.trackBatches = :trackBatches", { trackBatches: true })
      .andWhere("item.allowSplit = :allowSplit", { allowSplit: true });

    return queryBuilder.getMany();
  }
}
