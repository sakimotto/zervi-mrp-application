import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, Unique } from "typeorm";
import { Warehouse } from "./warehouse.model";
import { UnitOfMeasurement } from "./unit-of-measurement.model";

/**
 * Storage Location Entity
 * 
 * Represents specific storage locations within warehouses.
 * Examples include racks, bins, and shelf locations.
 */
@Entity("storage_locations")
@Unique(["warehouse", "locationCode"])
export class StorageLocation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Warehouse, warehouse => warehouse.storageLocations)
  @JoinColumn({ name: "warehouse_id" })
  warehouse: Warehouse;

  @Column({ name: "location_code", length: 50 })
  locationCode: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  capacity: number;

  @ManyToOne(() => UnitOfMeasurement, { nullable: true })
  @JoinColumn({ name: "capacity_uom_id" })
  capacityUom: UnitOfMeasurement;

  @Column({ name: "is_active", default: true })
  isActive: boolean;

  // Using string references to avoid circular dependencies
  @OneToMany("Inventory", "storageLocation")
  inventories: any[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
