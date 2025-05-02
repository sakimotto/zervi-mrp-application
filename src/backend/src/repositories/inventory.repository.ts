import { EntityRepository, Repository, getRepository } from "typeorm";
import { Inventory } from "../models/inventory/inventory.model";
import { Item } from "../models/inventory/item.model";

@EntityRepository(Inventory)
export class InventoryRepository extends Repository<Inventory> {
  
  /**
   * Get total quantity for an item across all warehouses
   */
  async getTotalQuantityForItem(itemId: number): Promise<number> {
    const result = await this.createQueryBuilder('inventory')
      .select('SUM(inventory.quantityOnHand)', 'total')
      .where('inventory.item.id = :itemId', { itemId })
      .getRawOne();
    
    return result.total || 0;
  }

  /**
   * Get available quantity for an item in a specific warehouse
   */
  async getAvailableQuantity(itemId: number, warehouseId: number): Promise<number> {
    const result = await this.createQueryBuilder('inventory')
      .select('SUM(inventory.quantityAvailable)', 'available')
      .where('inventory.item.id = :itemId', { itemId })
      .andWhere('inventory.warehouse.id = :warehouseId', { warehouseId })
      .getRawOne();
    
    return result.available || 0;
  }

  /**
   * Get inventory levels by warehouse for an item
   */
  async getInventoryLevelsByWarehouse(itemId: number): Promise<any[]> {
    return this.createQueryBuilder('inventory')
      .select('warehouse.id', 'warehouseId')
      .addSelect('warehouse.name', 'warehouseName')
      .addSelect('SUM(inventory.quantityOnHand)', 'quantityOnHand')
      .addSelect('SUM(inventory.quantityAllocated)', 'quantityAllocated')
      .addSelect('SUM(inventory.quantityAvailable)', 'quantityAvailable')
      .leftJoin('inventory.warehouse', 'warehouse')
      .where('inventory.item.id = :itemId', { itemId })
      .groupBy('warehouse.id')
      .addGroupBy('warehouse.name')
      .getRawMany();
  }

  /**
   * Get inventory items with low stock
   */
  async getLowStockItems(): Promise<any[]> {
    const itemRepository = getRepository(Item);
    
    // This is a complex query that joins inventory with items
    // and compares current quantity with reorder point
    return this.createQueryBuilder('inventory')
      .select('item.id', 'itemId')
      .addSelect('item.name', 'itemName')
      .addSelect('item.itemCode', 'itemCode')
      .addSelect('SUM(inventory.quantityOnHand)', 'totalQuantity')
      .addSelect('item.reorderPoint', 'reorderPoint')
      .addSelect('item.criticalThreshold', 'criticalThreshold')
      .innerJoin('inventory.item', 'item')
      .groupBy('item.id')
      .addGroupBy('item.name')
      .addGroupBy('item.itemCode')
      .addGroupBy('item.reorderPoint')
      .addGroupBy('item.criticalThreshold')
      .having('SUM(inventory.quantityOnHand) <= item.reorderPoint')
      .orderBy('(SUM(inventory.quantityOnHand) / NULLIF(item.reorderPoint, 0))', 'ASC')
      .getRawMany();
  }

  /**
   * Get out of stock items
   */
  async getOutOfStockItems(): Promise<any[]> {
    return this.createQueryBuilder('inventory')
      .select('item.id', 'itemId')
      .addSelect('item.name', 'itemName')
      .addSelect('item.itemCode', 'itemCode')
      .addSelect('SUM(inventory.quantityOnHand)', 'totalQuantity')
      .innerJoin('inventory.item', 'item')
      .groupBy('item.id')
      .addGroupBy('item.name')
      .addGroupBy('item.itemCode')
      .having('SUM(inventory.quantityOnHand) <= 0')
      .getRawMany();
  }

  /**
   * Get inventory value by warehouse
   */
  async getInventoryValueByWarehouse(): Promise<any[]> {
    return this.createQueryBuilder('inventory')
      .select('warehouse.id', 'warehouseId')
      .addSelect('warehouse.name', 'warehouseName')
      .addSelect('SUM(inventory.quantityOnHand * item.costPerUnit)', 'totalValue')
      .innerJoin('inventory.warehouse', 'warehouse')
      .innerJoin('inventory.item', 'item')
      .groupBy('warehouse.id')
      .addGroupBy('warehouse.name')
      .getRawMany();
  }

  /**
   * Get inventory value by category
   */
  async getInventoryValueByCategory(): Promise<any[]> {
    return this.createQueryBuilder('inventory')
      .select('category.id', 'categoryId')
      .addSelect('category.name', 'categoryName')
      .addSelect('SUM(inventory.quantityOnHand * item.costPerUnit)', 'totalValue')
      .innerJoin('inventory.item', 'item')
      .innerJoin('item.category', 'category')
      .groupBy('category.id')
      .addGroupBy('category.name')
      .getRawMany();
  }
}