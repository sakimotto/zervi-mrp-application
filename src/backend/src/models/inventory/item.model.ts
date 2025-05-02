import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, ManyToMany } from "typeorm";
import { Division } from "../division.model";
import { ItemCategory } from "./item-category.model";
import { UnitOfMeasurement } from "./unit-of-measurement.model";
import { ItemTag } from "./item-tag.model";

/**
 * Item Entity
 *
 * Represents inventory items in the Zervi MRP system.
 * This includes raw materials, finished goods, and semi-finished goods.
 */
@Entity("items")
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "item_code", length: 50, unique: true })
  itemCode: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @ManyToOne(() => ItemCategory, category => category.items)
  @JoinColumn({ name: "category_id" })
  category: ItemCategory;

  @ManyToOne(() => UnitOfMeasurement)
  @JoinColumn({ name: "primary_uom_id" })
  primaryUom: UnitOfMeasurement;

  @ManyToOne(() => UnitOfMeasurement, { nullable: true })
  @JoinColumn({ name: "secondary_uom_id" })
  secondaryUom: UnitOfMeasurement;

  @Column({ name: "uom_conversion_factor", type: "decimal", precision: 10, scale: 4, default: 1 })
  uomConversionFactor: number;

  @Column({ name: "item_type", length: 50 })
  itemType: string; // 'raw_material', 'finished_good', 'semi_finished', 'consumable'

  @Column({ name: "min_order_quantity", type: "decimal", precision: 10, scale: 2, default: 0 })
  minOrderQuantity: number;

  @Column({ name: "lead_time_days", default: 0 })
  leadTimeDays: number;

  @Column({ name: "is_active", default: true })
  isActive: boolean;

  // Special tracking fields for the enhanced inventory features
  @Column({ name: "track_batches", default: false })
  trackBatches: boolean;

  @Column({ name: "track_serials", default: false })
  trackSerials: boolean;

  @Column({ name: "allow_split", default: false })
  allowSplit: boolean;

  // Reorder point management fields
  @Column({ name: "reorder_point", type: "decimal", precision: 10, scale: 2, default: 0 })
  reorderPoint: number;

  @Column({ name: "reorder_quantity", type: "decimal", precision: 10, scale: 2, default: 0 })
  reorderQuantity: number;

  @Column({ name: "critical_threshold", type: "decimal", precision: 10, scale: 2, default: 0 })
  criticalThreshold: number;

  @Column({ name: "auto_reorder", default: false })
  autoReorder: boolean;

  // Barcode/QR code support
  @Column({ length: 100, nullable: true })
  barcode: string;

  @Column({ name: "barcode_type", length: 50, nullable: true })
  barcodeType: string;

  @Column({ name: "qr_code_data", type: "text", nullable: true })
  qrCodeData: string;

  @ManyToOne(() => Division)
  @JoinColumn({ name: "division_id" })
  division: Division;

  @Column({ type: "jsonb", nullable: true })
  specifications: object;

  // Using string references to avoid circular dependencies
  @OneToMany("LotTracking", "item")
  lots: any[];

  @OneToMany("Inventory", "item")
  inventories: any[];

  @OneToMany("SerialNumber", "item")
  serialNumbers: any[];

  @OneToMany("InventoryTransaction", "item")
  transactions: any[];

  @OneToMany("ItemAttribute", "item")
  attributes: any[];

  @OneToMany("InventoryAlert", "item")
  alerts: any[];

  @ManyToMany(() => ItemTag, tag => tag.items)
  tags: ItemTag[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
