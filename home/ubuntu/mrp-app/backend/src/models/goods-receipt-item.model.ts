import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { GoodsReceipt } from "./goods-receipt.model";
import { PurchaseOrderItem } from "./purchase-order-item.model";
import { Item } from "./item.model";
import { UnitOfMeasurement } from "./unit-of-measurement.model";
import { Warehouse } from "./warehouse.model";
import { StorageLocation } from "./storage-location.model";

@Entity("goods_receipt_items")
export class GoodsReceiptItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => GoodsReceipt)
  @JoinColumn({ name: "goods_receipt_id" })
  goods_receipt: GoodsReceipt;

  @Column()
  goods_receipt_id: number;

  @ManyToOne(() => PurchaseOrderItem)
  @JoinColumn({ name: "purchase_order_item_id" })
  purchase_order_item: PurchaseOrderItem;

  @Column()
  purchase_order_item_id: number;

  @ManyToOne(() => Item)
  @JoinColumn({ name: "item_id" })
  item: Item;

  @Column()
  item_id: number;

  @Column({ type: "decimal", precision: 15, scale: 4 })
  quantity: number;

  @ManyToOne(() => UnitOfMeasurement)
  @JoinColumn({ name: "uom_id" })
  uom: UnitOfMeasurement;

  @Column()
  uom_id: number;

  @Column({ nullable: true })
  lot_number: string;

  @Column({ type: "date", nullable: true })
  expiry_date: Date;

  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: "warehouse_id" })
  warehouse: Warehouse;

  @Column()
  warehouse_id: number;

  @ManyToOne(() => StorageLocation, { nullable: true })
  @JoinColumn({ name: "location_id" })
  location: StorageLocation;

  @Column({ nullable: true })
  location_id: number;

  @Column({
    type: "enum",
    enum: ["pending", "passed", "failed"],
    default: "pending"
  })
  quality_check_status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
