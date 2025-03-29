import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Division } from "./division.model";
import { Item } from "./item.model";
import { Bom } from "./bom.model";
import { Routing } from "./routing.model";
import { UnitOfMeasurement } from "./unit-of-measurement.model";
import { User } from "./user.model";
import { CustomerOrder } from "./customer-order.model";

@Entity("manufacturing_orders")
export class ManufacturingOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Division)
  @JoinColumn({ name: "division_id" })
  division: Division;

  @Column()
  division_id: number;

  @Column()
  order_number: string;

  @ManyToOne(() => Item)
  @JoinColumn({ name: "item_id" })
  item: Item;

  @Column()
  item_id: number;

  @ManyToOne(() => Bom)
  @JoinColumn({ name: "bom_id" })
  bom: Bom;

  @Column()
  bom_id: number;

  @ManyToOne(() => Routing)
  @JoinColumn({ name: "routing_id" })
  routing: Routing;

  @Column()
  routing_id: number;

  @Column({ type: "decimal", precision: 15, scale: 4 })
  quantity: number;

  @ManyToOne(() => UnitOfMeasurement)
  @JoinColumn({ name: "uom_id" })
  uom: UnitOfMeasurement;

  @Column()
  uom_id: number;

  @Column({
    type: "enum",
    enum: ["planned", "in_progress", "completed", "cancelled"],
    default: "planned"
  })
  status: string;

  @Column({ default: 0 })
  priority: number;

  @Column({ type: "date" })
  planned_start_date: Date;

  @Column({ type: "date" })
  planned_end_date: Date;

  @Column({ type: "date", nullable: true })
  actual_start_date: Date;

  @Column({ type: "date", nullable: true })
  actual_end_date: Date;

  @ManyToOne(() => CustomerOrder, { nullable: true })
  @JoinColumn({ name: "customer_order_id" })
  customer_order: CustomerOrder;

  @Column({ nullable: true })
  customer_order_id: number;

  @ManyToOne(() => ManufacturingOrder, { nullable: true })
  @JoinColumn({ name: "parent_mo_id" })
  parent_mo: ManufacturingOrder;

  @Column({ nullable: true })
  parent_mo_id: number;

  @Column({ type: "text", nullable: true })
  notes: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "created_by" })
  created_by_user: User;

  @Column()
  created_by: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
