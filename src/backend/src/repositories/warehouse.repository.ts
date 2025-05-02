import { EntityRepository, Repository } from "typeorm";
import { Warehouse } from "../models/inventory/warehouse.model";

@EntityRepository(Warehouse)
export class WarehouseRepository extends Repository<Warehouse> {
  
  /**
   * Find warehouses with their utilization statistics
   */
  async findWarehousesWithUtilization(): Promise<any[]> {
    const warehouses = await this.find({
      relations: ['storageLocations', 'inventories']
    });
    
    return warehouses.map(warehouse => {
      // Calculate total capacity and used space
      let totalCapacity = 0;
      let usedSpace = 0;
      
      if (warehouse.storageLocations && warehouse.storageLocations.length > 0) {
        for (const location of warehouse.storageLocations) {
          if (location.capacity) {
            totalCapacity += Number(location.capacity);
          }
        }
      }
      
      // Calculate used space based on inventory quantities
      // This is a simplified calculation and might need to be adjusted
      // based on how you want to measure warehouse utilization
      if (warehouse.inventories && warehouse.inventories.length > 0) {
        for (const inventory of warehouse.inventories) {
          if (inventory.quantityOnHand) {
            usedSpace += Number(inventory.quantityOnHand);
          }
        }
      }
      
      const utilizationPercentage = totalCapacity > 0 
        ? Math.min(100, Math.round((usedSpace / totalCapacity) * 100)) 
        : 0;
      
      return {
        id: warehouse.id,
        name: warehouse.name,
        location: warehouse.location,
        description: warehouse.description,
        isActive: warehouse.isActive,
        totalCapacity,
        usedSpace,
        availableSpace: totalCapacity - usedSpace,
        utilizationPercentage,
        sectionCount: warehouse.storageLocations ? warehouse.storageLocations.length : 0
      };
    });
  }

  /**
   * Find warehouse by ID with utilization statistics
   */
  async findWarehouseWithUtilization(id: number): Promise<any> {
    const warehouse = await this.findOne({
      where: { id },
      relations: ['storageLocations', 'inventories']
    });
    
    if (!warehouse) {
      return null;
    }
    
    // Calculate total capacity and used space
    let totalCapacity = 0;
    let usedSpace = 0;
    
    if (warehouse.storageLocations && warehouse.storageLocations.length > 0) {
      for (const location of warehouse.storageLocations) {
        if (location.capacity) {
          totalCapacity += Number(location.capacity);
        }
      }
    }
    
    // Calculate used space based on inventory quantities
    if (warehouse.inventories && warehouse.inventories.length > 0) {
      for (const inventory of warehouse.inventories) {
        if (inventory.quantityOnHand) {
          usedSpace += Number(inventory.quantityOnHand);
        }
      }
    }
    
    const utilizationPercentage = totalCapacity > 0 
      ? Math.min(100, Math.round((usedSpace / totalCapacity) * 100)) 
      : 0;
    
    return {
      id: warehouse.id,
      name: warehouse.name,
      location: warehouse.location,
      description: warehouse.description,
      isActive: warehouse.isActive,
      totalCapacity,
      usedSpace,
      availableSpace: totalCapacity - usedSpace,
      utilizationPercentage,
      sectionCount: warehouse.storageLocations ? warehouse.storageLocations.length : 0,
      sections: warehouse.storageLocations
    };
  }

  /**
   * Get warehouse utilization summary for dashboard
   */
  async getWarehouseUtilizationSummary(): Promise<any[]> {
    const warehouses = await this.findWarehousesWithUtilization();
    
    return warehouses.map(warehouse => ({
      id: warehouse.id,
      name: warehouse.name,
      utilizationPercentage: warehouse.utilizationPercentage
    }));
  }
}