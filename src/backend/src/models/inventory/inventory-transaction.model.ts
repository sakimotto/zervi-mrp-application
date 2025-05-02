import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from "typeorm";
import { Item } from "./item.model";
import { Warehouse } from "./warehouse.model";
import { StorageLocation } from "./storage-location.model";
import { LotTracking } from "./lot-tracking.model";
import { SerialNumber } from "./serial-number.model";
import { User } from "../user.model";

/**
 * Inventory Transaction Entity
 * 
 * Represents all inventory movements and transactions.
 * This entity is central to inventory tracking and history.
 */
@Entity("inventory_transactions")
@Index(["transactionDate"])
@Index(["referenceType", "referenceId"])
export class InventoryTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "transaction_type", length: 50 })
  transactionType: string; // 'receipt', 'issue', 'transfer', 'adjustment', 'consumption', etc.

  @ManyToOne(() => Item)
  @JoinColumn({ name: "item_id" })
  item: Item;

  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: "warehouse_id" })
  warehouse: Warehouse;

  @ManyToOne(() => StorageLocation, { nullable: true })
  @JoinColumn({ name: "storage_location_id" })
  storageLocation: StorageLocation;

  @ManyToOne(() => LotTracking, { nullable: true })
  @JoinColumn({ name: "lot_id" })
  lot: LotTracking;

  @ManyToOne(() => SerialNumber, { nullable: true })
  @JoinColumn({ name: "serial_number_id" })
  serialNumber: SerialNumber;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  quantity: number;

  @Column({ name: "reference_type", length: 50, nullable: true })
  referenceType: string; // 'purchase_order', 'manufacturing_order', 'adjustment', etc.

  @Column({ name: "reference_id", nullable: true })
  referenceId: number;

  @Column({ type: "text", nullable: true })
  notes: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "performed_by" })
  performedBy: User;

  @Column({ name: "transaction_date", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  transactionDate: Date;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}