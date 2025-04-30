import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, Index } from "typeorm";
import { Division } from "../division.model";
import { Item } from "./item.model";

/**
 * Lot Tracking Entity
 * 
 * Represents batch/lot tracking information for inventory items.
 * This is a key entity for batch management and quality control.
 */
@Entity("lot_tracking")
@Index(["lotNumber", "item"])
export class LotTracking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "lot_number", length: 100 })
  lotNumber: string;

  @ManyToOne(() => Item, item => item.lots)
  @JoinColumn({ name: "item_id" })
  item: Item;

  @Column({ name: "supplier_id", nullable: true })
  supplierId: number;

  @Column({ name: "supplier_batch_number", length: 100, nullable: true })
  supplierBatchNumber: string;

  @Column({ name: "received_date", type: "date" })
  receivedDate: Date;

  @Column({ name: "expiration_date", type: "date", nullable: true })
  expirationDate: Date;

  @Column({ name: "manufacturing_date", type: "date", nullable: true })
  manufacturingDate: Date;

  @Column({ name: "quality_status", length: 20, default: "pending" })
  qualityStatus: string; // 'pending', 'approved', 'rejected'

  @Column({ name: "quantity", type: "decimal", precision: 10, scale: 2, default: 0 })
  quantity: number;

  @Column({ name: "remaining_quantity", type: "decimal", precision: 10, scale: 2, default: 0 })
  remainingQuantity: number;

  @Column({ name: "status", length: 50, default: "In Stock" })
  status: string; // 'In Stock', 'Quality Check', 'Reserved', etc.

  @Column({ name: "parent_lot_id", nullable: true })
  parentLotId: number;

  @Column({ name: "certification_info", type: "text", nullable: true })
  certificationInfo: string;

  @Column({ type: "text", nullable: true })
  notes: string;

  @ManyToOne(() => Division)
  @JoinColumn({ name: "division_id" })
  division: Division;

  // Using string references to avoid circular dependencies
  @OneToMany("Inventory", "lot")
  inventories: any[];

  @OneToMany("SerialNumber", "lot")
  serialNumbers: any[];

  @OneToMany("FabricRoll", "lot")
  fabricRolls: any[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
