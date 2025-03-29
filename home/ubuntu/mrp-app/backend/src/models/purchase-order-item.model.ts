import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { PurchaseOrder } from "./purchase-order.model";
import { Item } from "./item.model";
import { UnitOfMeasurement } from "./unit-of-measurement.model";

@Entity("purchase_order_items")
export class PurchaseOrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PurchaseOrder)
  @JoinColumn({ name: "purchase_order_id" })
  purchase_order: PurchaseOrder;

  @Column()
  purchase_order_id: number;

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

  @Column({ type: "decimal", precision: 15, scale: 4 })
  unit_price: number;

  @Column({ type: "decimal", precision: 6, scale: 2, default: 0 })
  discount: number;

  @Column({ type: "decimal", precision: 6, scale: 2, default: 0 })
  tax: number;

  @Column({ type: "decimal", precision: 15, scale: 4 })
  total_price: number;

  @Column({ type: "date" })
  required_date: Date;

  @Column({
    type: "enum",
    enum: ["pending", "partially_received", "received"],
    default: "pending"
  })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
