import { getCustomRepository } from "typeorm";
import { InventoryTransactionRepository } from "../repositories/inventory-transaction.repository";
import { InventoryTransaction } from "../models/inventory/inventory-transaction.model";
import { InventoryRepository } from "../repositories/inventory.repository";
import { ItemRepository } from "../repositories/item.repository";
import { WarehouseRepository } from "../repositories/warehouse.repository";
import { StorageLocationRepository } from "../repositories/storage-location.repository";
import { LotTrackingRepository } from "../repositories/lot-tracking.repository";
import { SerialNumberRepository } from "../repositories/serial-number.repository";
import { InventoryAlertService } from "./inventory-alert.service";

export class InventoryTransactionService {
  private transactionRepository: InventoryTransactionRepository;
  private inventoryRepository: InventoryRepository;
  private itemRepository: ItemRepository;
  private warehouseRepository: WarehouseRepository;
  private storageLocationRepository: StorageLocationRepository;
  private lotTrackingRepository: LotTrackingRepository;
  private serialNumberRepository: SerialNumberRepository;
  private alertService: InventoryAlertService;

  constructor() {
    this.transactionRepository = getCustomRepository(InventoryTransactionRepository);
    this.inventoryRepository = getCustomRepository(InventoryRepository);
    this.itemRepository = getCustomRepository(ItemRepository);
    this.warehouseRepository = getCustomRepository(WarehouseRepository);
    this.storageLocationRepository = getCustomRepository(StorageLocationRepository);
    this.lotTrackingRepository = getCustomRepository(LotTrackingRepository);
    this.serialNumberRepository = getCustomRepository(SerialNumberRepository);
    this.alertService = new InventoryAlertService();
  }

  /**
   * Create a new inventory transaction and update inventory quantities
   */
  async createTransaction(transactionData: Partial<InventoryTransaction>): Promise<InventoryTransaction> {
    // Validate required fields
    if (!transactionData.transactionType) {
      throw new Error('Transaction type is required');
    }
    if (!transactionData.item) {
      throw new Error('Item is required');
    }
    if (!transactionData.warehouse) {
      throw new Error('Warehouse is required');
    }
    if (transactionData.quantity === undefined || transactionData.quantity === null) {
      throw new Error('Quantity is required');
    }

    // Create transaction
    const transaction = this.transactionRepository.create(transactionData);
    
    // Update inventory quantities
    await this.updateInventoryQuantities(transaction);
    
    // Save transaction
    const savedTransaction = await this.transactionRepository.save(transaction);
    
    // Check for low stock conditions
    await this.checkLowStockConditions(transaction.item['id']);
    
    return savedTransaction;
  }

  /**
   * Update inventory quantities based on transaction
   */
  private async updateInventoryQuantities(transaction: InventoryTransaction): Promise<void> {
    const { item, warehouse, storageLocation, lot, quantity } = transaction;
    
    // Find or create inventory record
    let inventory = await this.inventoryRepository.findOne({
      where: {
        item: { id: item['id'] },
        warehouse: { id: warehouse['id'] },
        storageLocation: storageLocation ? { id: storageLocation['id'] } : null,
        lot: lot ? { id: lot['id'] } : null
      }
    });

    if (!inventory) {
      // Create new inventory record if it doesn't exist
      inventory = this.inventoryRepository.create({
        item,
        warehouse,
        storageLocation,
        lot,
        quantityOnHand: 0,
        quantityAllocated: 0
      });
    }

    // Update quantities based on transaction type
    switch (transaction.transactionType) {
      case 'receipt':
        inventory.quantityOnHand += quantity;
        break;
      case 'issue':
        inventory.quantityOnHand -= quantity;
        break;
      case 'adjustment':
        inventory.quantityOnHand += quantity; // Can be positive or negative
        break;
      case 'allocation':
        inventory.quantityAllocated += quantity;
        break;
      case 'deallocation':
        inventory.quantityAllocated -= quantity;
        break;
      // Add more transaction types as needed
    }

    // Save updated inventory
    await this.inventoryRepository.save(inventory);

    // If this is a lot-tracked item, update lot quantities
    if (lot) {
      const lotRecord = await this.lotTrackingRepository.findOne({ where: { id: lot['id'] } });
      if (lotRecord) {
        if (['receipt', 'adjustment'].includes(transaction.transactionType) && quantity > 0) {
          lotRecord.remainingQuantity += quantity;
        } else if (['issue', 'adjustment'].includes(transaction.transactionType) && quantity < 0) {
          lotRecord.remainingQuantity -= Math.abs(quantity);
        }
        await this.lotTrackingRepository.save(lotRecord);
      }
    }
  }

  /**
   * Check for low stock conditions and create alerts if needed
   */
  private async checkLowStockConditions(itemId: number): Promise<void> {
    const item = await this.itemRepository.findOne({ where: { id: itemId } });
    if (!item) return;

    // Get total quantity on hand across all warehouses
    const totalQuantity = await this.inventoryRepository.getTotalQuantityForItem(itemId);
    
    // Check against reorder point and critical threshold
    if (totalQuantity <= item.criticalThreshold) {
      // Create critical stock alert
      await this.alertService.createAlert({
        alertType: 'critical_stock',
        item: { id: itemId } as any,
        message: `Critical stock level reached for ${item.name}. Current quantity: ${totalQuantity}, Critical threshold: ${item.criticalThreshold}`
      });
    } else if (totalQuantity <= item.reorderPoint) {
      // Create low stock alert
      await this.alertService.createAlert({
        alertType: 'low_stock',
        item: { id: itemId } as any,
        message: `Low stock level for ${item.name}. Current quantity: ${totalQuantity}, Reorder point: ${item.reorderPoint}`
      });
      
      // If auto-reorder is enabled, trigger reorder process
      if (item.autoReorder) {
        // Implement auto-reorder logic here
        console.log(`Auto-reorder triggered for item ${item.name}`);
      }
    }
  }

  /**
   * Get transaction history for an item
   */
  async getTransactionHistoryForItem(itemId: number): Promise<any[]> {
    return this.transactionRepository.getItemMovementHistory(itemId);
  }

  /**
   * Get recent transactions for dashboard
   */
  async getRecentTransactions(limit: number = 10): Promise<InventoryTransaction[]> {
    return this.transactionRepository.getRecentTransactions(limit);
  }

  /**
   * Get transactions by date range
   */
  async getTransactionsByDateRange(startDate: Date, endDate: Date): Promise<InventoryTransaction[]> {
    return this.transactionRepository.findByDateRange(startDate, endDate);
  }

  /**
   * Get transactions by reference
   */
  async getTransactionsByReference(referenceType: string, referenceId: number): Promise<InventoryTransaction[]> {
    return this.transactionRepository.findByReference(referenceType, referenceId);
  }
}