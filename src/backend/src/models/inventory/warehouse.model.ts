import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Division } from "../division.model";
import { StorageLocation } from "./storage-location.model";
import { Inventory } from "./inventory.model";

/**
 * Warehouse Entity
 * 
 * Represents physical warehouses in the Zervi MRP system.
 * Each warehouse can contain multiple storage locations.
 */
@Entity("warehouses")
export class Warehouse {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 255, nullable: true })
  location: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @ManyToOne(() => Division)
  @JoinColumn({ name: "division_id" })
  division: Division;

  @Column({ name: "is_active", default: true })
  isActive: boolean;

  @OneToMany(() => StorageLocation, storageLocation => storageLocation.warehouse)
  storageLocations: StorageLocation[];

  @OneToMany(() => Inventory, inventory => inventory.warehouse)
  inventories: Inventory[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
