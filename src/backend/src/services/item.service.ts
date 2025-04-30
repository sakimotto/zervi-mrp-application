import { ItemRepository } from "../repositories/item.repository";
import { Item } from "../models/inventory";

/**
 * Item Service
 * 
 * Provides business logic for inventory item operations.
 * Acts as an intermediary between controllers and repositories.
 */
export class ItemService {
  private itemRepository: ItemRepository;

  constructor() {
    this.itemRepository = new ItemRepository();
  }

  /**
   * Get all items with optional filtering
   * @param filters Optional filters (category, type, etc.)
   * @returns Array of inventory items
   */
  async getAllItems(filters?: {
    itemType?: string;
    isActive?: boolean;
    category?: number;
    trackBatches?: boolean;
    trackSerials?: boolean;
  }): Promise<Item[]> {
    return this.itemRepository.findAll(filters);
  }

  /**
   * Get item by ID
   * @param id Item ID
   * @returns Item object or null if not found
   */
  async getItemById(id: number): Promise<Item | null> {
    return this.itemRepository.findById(id);
  }

  /**
   * Get item by item code
   * @param itemCode Item code
   * @returns Item object or null if not found
   */
  async getItemByCode(itemCode: string): Promise<Item | null> {
    return this.itemRepository.findByItemCode(itemCode);
  }

  /**
   * Create a new inventory item
   * @param itemData Item data
   * @returns Created item
   */
  async createItem(itemData: Partial<Item>): Promise<Item> {
    // Generate an item code if not provided
    if (!itemData.itemCode) {
      const prefix = this.getItemTypePrefix(itemData.itemType || 'raw_material');
      const timestamp = new Date().getTime().toString().slice(-6);
      itemData.itemCode = `${prefix}-${timestamp}`;
    }
    
    return this.itemRepository.create(itemData);
  }

  /**
   * Update an existing item
   * @param id Item ID
   * @param itemData Updated item data
   * @returns Updated item or null if not found
   */
  async updateItem(id: number, itemData: Partial<Item>): Promise<Item | null> {
    // Check if item exists
    const existingItem = await this.itemRepository.findById(id);
    if (!existingItem) {
      return null;
    }
    
    return this.itemRepository.update(id, itemData);
  }

  /**
   * Delete an inventory item
   * @param id Item ID
   * @returns True if successfully deleted
   */
  async deleteItem(id: number): Promise<boolean> {
    return this.itemRepository.delete(id);
  }

  /**
   * Get all items that support batch tracking
   * @returns Array of items with batch tracking enabled
   */
  async getBatchTrackingItems(): Promise<Item[]> {
    return this.itemRepository.findBatchTrackingItems();
  }

  /**
   * Get all items that support serial number tracking
   * @returns Array of items with serial tracking enabled
   */
  async getSerialTrackingItems(): Promise<Item[]> {
    return this.itemRepository.findSerialTrackingItems();
  }

  /**
   * Get all fabric items that support splitting
   * @returns Array of items with split functionality enabled
   */
  async getSplittableItems(): Promise<Item[]> {
    return this.itemRepository.findSplittableItems();
  }

  /**
   * Enable batch tracking for an item
   * @param id Item ID
   * @returns Updated item or null if not found
   */
  async enableBatchTracking(id: number): Promise<Item | null> {
    return this.itemRepository.update(id, { trackBatches: true });
  }

  /**
   * Enable serial number tracking for an item
   * @param id Item ID
   * @returns Updated item or null if not found
   */
  async enableSerialTracking(id: number): Promise<Item | null> {
    return this.itemRepository.update(id, { trackSerials: true });
  }

  /**
   * Enable split functionality for an item
   * @param id Item ID
   * @returns Updated item or null if not found
   */
  async enableSplitFunctionality(id: number): Promise<Item | null> {
    // For split functionality, we need batch tracking as well
    return this.itemRepository.update(id, { 
      trackBatches: true,
      allowSplit: true 
    });
  }

  /**
   * Helper method to generate item code prefixes based on type
   * @param itemType Type of item
   * @returns Prefix string
   */
  private getItemTypePrefix(itemType: string): string {
    const prefixMap: Record<string, string> = {
      'raw_material': 'RM',
      'finished_good': 'FG',
      'semi_finished': 'SF',
      'consumable': 'CON'
    };
    
    return prefixMap[itemType] || 'ITM';
  }
}
