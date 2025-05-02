import { EntityRepository, Repository } from "typeorm";
import { InventoryAlert } from "../models/inventory/inventory-alert.model";

@EntityRepository(InventoryAlert)
export class InventoryAlertRepository extends Repository<InventoryAlert> {
  
  /**
   * Find active alerts
   */
  async findActiveAlerts(): Promise<InventoryAlert[]> {
    return this.find({
      where: { isActive: true },
      relations: ['item', 'warehouse'],
      order: { createdAt: 'DESC' }
    });
  }

  /**
   * Find active alerts by type
   */
  async findActiveAlertsByType(alertType: string): Promise<InventoryAlert[]> {
    return this.find({
      where: { 
        isActive: true,
        alertType
      },
      relations: ['item', 'warehouse'],
      order: { createdAt: 'DESC' }
    });
  }

  /**
   * Find active alerts for a specific item
   */
  async findActiveAlertsForItem(itemId: number): Promise<InventoryAlert[]> {
    return this.find({
      where: { 
        isActive: true,
        item: { id: itemId }
      },
      relations: ['warehouse'],
      order: { createdAt: 'DESC' }
    });
  }

  /**
   * Find active alerts for a specific warehouse
   */
  async findActiveAlertsForWarehouse(warehouseId: number): Promise<InventoryAlert[]> {
    return this.find({
      where: { 
        isActive: true,
        warehouse: { id: warehouseId }
      },
      relations: ['item'],
      order: { createdAt: 'DESC' }
    });
  }

  /**
   * Acknowledge an alert
   */
  async acknowledgeAlert(alertId: number, userId: number): Promise<InventoryAlert> {
    const alert = await this.findOne({ where: { id: alertId } });
    if (!alert) {
      throw new Error('Alert not found');
    }

    alert.isAcknowledged = true;
    alert.acknowledgedBy = { id: userId } as any;
    alert.acknowledgedAt = new Date();
    
    return this.save(alert);
  }

  /**
   * Resolve (deactivate) an alert
   */
  async resolveAlert(alertId: number): Promise<InventoryAlert> {
    const alert = await this.findOne({ where: { id: alertId } });
    if (!alert) {
      throw new Error('Alert not found');
    }

    alert.isActive = false;
    
    return this.save(alert);
  }

  /**
   * Get alert counts by type for dashboard
   */
  async getAlertCountsByType(): Promise<any[]> {
    return this.createQueryBuilder('alert')
      .select('alert.alertType', 'type')
      .addSelect('COUNT(*)', 'count')
      .where('alert.isActive = :isActive', { isActive: true })
      .groupBy('alert.alertType')
      .getRawMany();
  }
}