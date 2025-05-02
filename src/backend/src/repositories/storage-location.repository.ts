import { EntityRepository, Repository } from "typeorm";
import { StorageLocation } from "../models/inventory/storage-location.model";

@EntityRepository(StorageLocation)
export class StorageLocationRepository extends Repository<StorageLocation> {
  
  /**
   * Find storage locations by warehouse ID
   */
  async findByWarehouseId(warehouseId: number): Promise<StorageLocation[]> {
    return this.find({
      where: { warehouse: { id: warehouseId } },
      relations: ['warehouse', 'capacityUom'],
      order: { locationCode: 'ASC' }
    });
  }

  /**
   * Find storage locations with their utilization statistics
   */
  async findLocationsWithUtilization(warehouseId: number): Promise<any[]> {
    const locations = await this.find({
      where: { warehouse: { id: warehouseId } },
      relations: ['warehouse', 'capacityUom', 'inventories'],
      order: { locationCode: 'ASC' }
    });
    
    return locations.map(location => {
      // Calculate used space based on inventory quantities
      let usedSpace = 0;
      
      if (location.inventories && location.inventories.length > 0) {
        for (const inventory of location.inventories) {
          if (inventory.quantityOnHand) {
            usedSpace += Number(inventory.quantityOnHand);
          }
        }
      }
      
      const capacity = location.capacity ? Number(location.capacity) : 0;
      const utilizationPercentage = capacity > 0 
        ? Math.min(100, Math.round((usedSpace / capacity) * 100)) 
        : 0;
      
      return {
        id: location.id,
        locationCode: location.locationCode,
        description: location.description,
        capacity,
        capacityUom: location.capacityUom,
        isActive: location.isActive,
        usedSpace,
        availableSpace: capacity - usedSpace,
        utilizationPercentage
      };
    });
  }

  /**
   * Find storage location by ID with utilization statistics
   */
  async findLocationWithUtilization(id: number): Promise<any> {
    const location = await this.findOne({
      where: { id },
      relations: ['warehouse', 'capacityUom', 'inventories']
    });
    
    if (!location) {
      return null;
    }
    
    // Calculate used space based on inventory quantities
    let usedSpace = 0;
    
    if (location.inventories && location.inventories.length > 0) {
      for (const inventory of location.inventories) {
        if (inventory.quantityOnHand) {
          usedSpace += Number(inventory.quantityOnHand);
        }
      }
    }
    
    const capacity = location.capacity ? Number(location.capacity) : 0;
    const utilizationPercentage = capacity > 0 
      ? Math.min(100, Math.round((usedSpace / capacity) * 100)) 
      : 0;
    
    return {
      id: location.id,
      locationCode: location.locationCode,
      description: location.description,
      capacity,
      capacityUom: location.capacityUom,
      isActive: location.isActive,
      usedSpace,
      availableSpace: capacity - usedSpace,
      utilizationPercentage,
      warehouse: location.warehouse,
      inventories: location.inventories
    };
  }

  /**
   * Get storage locations with high utilization
   */
  async getHighUtilizationLocations(threshold: number = 90): Promise<any[]> {
    const locations = await this.find({
      relations: ['warehouse', 'capacityUom', 'inventories']
    });
    
    return locations
      .map(location => {
        // Calculate used space based on inventory quantities
        let usedSpace = 0;
        
        if (location.inventories && location.inventories.length > 0) {
          for (const inventory of location.inventories) {
            if (inventory.quantityOnHand) {
              usedSpace += Number(inventory.quantityOnHand);
            }
          }
        }
        
        const capacity = location.capacity ? Number(location.capacity) : 0;
        const utilizationPercentage = capacity > 0 
          ? Math.round((usedSpace / capacity) * 100) 
          : 0;
        
        return {
          id: location.id,
          locationCode: location.locationCode,
          warehouse: location.warehouse,
          capacity,
          usedSpace,
          utilizationPercentage
        };
      })
      .filter(location => location.utilizationPercentage >= threshold)
      .sort((a, b) => b.utilizationPercentage - a.utilizationPercentage);
  }
}