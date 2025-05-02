import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from "typeorm";
import { Division } from "../division.model";
import { Item } from "./item.model";
import { Warehouse } from "./warehouse.model";
import { StorageLocation } from "./storage-location.model";
import { LotTracking } from "./lot-tracking.model";

/**
 * Inventory Entity
 * 
 * Represents the actual inventory quantities for items across locations.
 * Central entity for inventory management in the Zervi MRP system.
 */
@Entity("inventory")
@Index(["item", "warehouse", "storageLocation", "lot", "division"])
export class Inventory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Item, item => item.inventories)
  @JoinColumn({ name: "item_id" })
  item: Item;

  @ManyToOne(() => Warehouse, warehouse => warehouse.inventories)
  @JoinColumn({ name: "warehouse_id" })
  warehouse: Warehouse;

  @ManyToOne(() => StorageLocation, location => location.inventories, { nullable: true })
  @JoinColumn({ name: "storage_location_id" })
  storageLocation: StorageLocation;

  @ManyToOne(() => LotTracking, lot => lot.inventories, { nullable: true })
  @JoinColumn({ name: "lot_id" })
  lot: LotTracking;

  @Column({ name: "quantity_on_hand", type: "decimal", precision: 10, scale: 2, default: 0 })
  quantityOnHand: number;

  @Column({ name: "quantity_allocated", type: "decimal", precision: 10, scale: 2, default: 0 })
  quantityAllocated: number;

  // Using a regular computed column instead of Generated virtual
  @Column({
    name: "quantity_available",
    type: "decimal",
    precision: 10,
    scale: 2,
    generatedType: "STORED",
    asExpression: "quantity_on_hand - quantity_allocated",
  })
  quantityAvailable: number;

  @Column({ name: "last_count_date", type: "timestamp", nullable: true })
  lastCountDate: Date;

  @ManyToOne(() => Division)
  @JoinColumn({ name: "division_id" })
  division: Division;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
