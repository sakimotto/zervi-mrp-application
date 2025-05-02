import { EntityRepository, Repository, getRepository, Between, MoreThanOrEqual, LessThanOrEqual } from "typeorm";
import { InventoryTransaction } from "../models/inventory/inventory-transaction.model";
import { Item } from "../models/inventory/item.model";

@EntityRepository(InventoryTransaction)
export class InventoryTransactionRepository extends Repository<InventoryTransaction> {
  
  /**
   * Find transactions by item ID
   */
  async findByItemId(itemId: number): Promise<InventoryTransaction[]> {
    return this.find({
      where: { item: { id: itemId } },
      relations: ['warehouse', 'storageLocation', 'lot', 'serialNumber', 'performedBy'],
      order: { transactionDate: 'DESC' }
    });
  }

  /**
   * Find transactions by warehouse ID
   */
  async findByWarehouseId(warehouseId: number): Promise<InventoryTransaction[]> {
    return this.find({
      where: { warehouse: { id: warehouseId } },
      relations: ['item', 'storageLocation', 'lot', 'serialNumber', 'performedBy'],
      order: { transactionDate: 'DESC' }
    });
  }

  /**
   * Find transactions by date range
   */
  async findByDateRange(startDate: Date, endDate: Date): Promise<InventoryTransaction[]> {
    return this.find({
      where: {
        transactionDate: Between(startDate, endDate)
      },
      relations: ['item', 'warehouse', 'storageLocation', 'lot', 'serialNumber', 'performedBy'],
      order: { transactionDate: 'DESC' }
    });
  }

  /**
   * Find transactions by reference (e.g., purchase order, manufacturing order)
   */
  async findByReference(referenceType: string, referenceId: number): Promise<InventoryTransaction[]> {
    return this.find({
      where: {
        referenceType,
        referenceId
      },
      relations: ['item', 'warehouse', 'storageLocation', 'lot', 'serialNumber', 'performedBy'],
      order: { transactionDate: 'DESC' }
    });
  }

  /**
   * Find transactions by transaction type
   */
  async findByTransactionType(transactionType: string): Promise<InventoryTransaction[]> {
    return this.find({
      where: { transactionType },
      relations: ['item', 'warehouse', 'storageLocation', 'lot', 'serialNumber', 'performedBy'],
      order: { transactionDate: 'DESC' }
    });
  }

  /**
   * Get item movement history with running balance
   */
  async getItemMovementHistory(itemId: number): Promise<any[]> {
    const transactions = await this.findByItemId(itemId);
    
    // Calculate running balance
    let runningBalance = 0;
    return transactions.map(transaction => {
      runningBalance += transaction.quantity;
      return {
        ...transaction,
        runningBalance
      };
    });
  }

  /**
   * Get recent transactions for dashboard
   */
  async getRecentTransactions(limit: number = 10): Promise<InventoryTransaction[]> {
    return this.find({
      relations: ['item', 'warehouse', 'performedBy'],
      order: { transactionDate: 'DESC' },
      take: limit
    });
  }
}