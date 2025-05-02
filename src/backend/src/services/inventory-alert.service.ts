import { getCustomRepository } from "typeorm";
import { InventoryAlertRepository } from "../repositories/inventory-alert.repository";
import { InventoryAlert } from "../models/inventory/inventory-alert.model";

export class InventoryAlertService {
  private alertRepository: InventoryAlertRepository;

  constructor() {
    this.alertRepository = getCustomRepository(InventoryAlertRepository);
  }

  /**
   * Create a new inventory alert
   */
  async createAlert(alertData: Partial<InventoryAlert>): Promise<InventoryAlert> {
    // Validate required fields
    if (!alertData.alertType) {
      throw new Error('Alert type is required');
    }
    if (!alertData.item) {
      throw new Error('Item is required');
    }
    if (!alertData.message) {
      throw new Error('Message is required');
    }

    // Check if there's already an active alert of the same type for this item
    const existingAlert = await this.alertRepository.findOne({
      where: {
        alertType: alertData.alertType,
        item: { id: alertData.item['id'] },
        isActive: true
      }
    });

    if (existingAlert) {
      // Update the existing alert instead of creating a new one
      existingAlert.message = alertData.message;
      existingAlert.isAcknowledged = false;
      
      // Reset acknowledgement fields
      const updatedAlert = {
        ...existingAlert,
        acknowledgedBy: null as any,
        acknowledgedAt: null as any
      };
      
      if (alertData.warehouse) {
        existingAlert.warehouse = alertData.warehouse;
      }
      
      return this.alertRepository.save(updatedAlert);
    }

    // Create and save new alert
    const alert = this.alertRepository.create(alertData);
    return this.alertRepository.save(alert);
  }

  /**
   * Get all active alerts
   */
  async getActiveAlerts(): Promise<InventoryAlert[]> {
    return this.alertRepository.findActiveAlerts();
  }

  /**
   * Get active alerts by type
   */
  async getActiveAlertsByType(alertType: string): Promise<InventoryAlert[]> {
    return this.alertRepository.findActiveAlertsByType(alertType);
  }

  /**
   * Get active alerts for a specific item
   */
  async getActiveAlertsForItem(itemId: number): Promise<InventoryAlert[]> {
    return this.alertRepository.findActiveAlertsForItem(itemId);
  }

  /**
   * Acknowledge an alert
   */
  async acknowledgeAlert(alertId: number, userId: number): Promise<InventoryAlert> {
    return this.alertRepository.acknowledgeAlert(alertId, userId);
  }

  /**
   * Resolve (deactivate) an alert
   */
  async resolveAlert(alertId: number): Promise<InventoryAlert> {
    return this.alertRepository.resolveAlert(alertId);
  }

  /**
   * Get alert counts by type for dashboard
   */
  async getAlertCountsByType(): Promise<any[]> {
    return this.alertRepository.getAlertCountsByType();
  }
}