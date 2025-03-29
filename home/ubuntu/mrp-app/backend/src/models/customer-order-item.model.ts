import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { CustomerOrder } from "./customer-order.model";
import { Item } from "./item.model";
import { UnitOfMeasurement } from "./unit-of-measurement.model";

@Entity("customer_order_items")
export class CustomerOrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => CustomerOrder)
  @JoinColumn({ name: "customer_order_id" })
  customer_order: CustomerOrder;

  @Column()
  customer_order_id: number;

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

  @Column({
    type: "enum",
    enum: ["pending", "allocated", "shipped"],
    default: "pending"
  })
  status: string;

  @Column({ type: "date" })
  required_date: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
