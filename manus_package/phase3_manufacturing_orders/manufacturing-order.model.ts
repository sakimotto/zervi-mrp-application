// Placeholder for manufacturing-order.model.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Division } from "./division.model";
import { Item } from "./item.model";
import { BOM } from "./bom.model";
import { User } from "./user.model";

/**
 * Manufacturing Order Entity
 * 
 * Represents a manufacturing order in the Zervi MRP system.
 * A manufacturing order is used to produce a specific quantity of an item.
 */
@Entity("manufacturing_orders")
export class ManufacturingOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  order_number: string;

  @ManyToOne(() => Division)
  @JoinColumn({ name: "division_id" })
  division: Division;

  @Column()
  division_id: number;

  @ManyToOne(() => Item)
  @JoinColumn({ name: "item_id" })
  item: Item;

  @Column()
  item_id: number;

  @ManyToOne(() => BOM, { nullable: true })
  @JoinColumn({ name: "bom_id" })
  bom: BOM;

  @Column({ nullable: true })
  bom_id: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  quantity: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  completed_quantity: number;

  @Column({
    type: "enum",
    enum: ["draft", "planned", "in_progress", "completed", "cancelled"],
    default: "draft"
  })
  status: string;

  @Column({ type: "date" })
  planned_start_date: Date;

  @Column({ type: "date" })
  planned_end_date: Date;

  @Column({ type: "date", nullable: true })
  actual_start_date: Date;

  @Column({ type: "date", nullable: true })
  actual_end_date: Date;

  @Column({ type: "text", nullable: true })
  notes: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "created_by" })
  createdBy: User;

  @Column({ nullable: true })
  created_by: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "assigned_to" })
  assignedTo: User;

  @Column({ nullable: true })
  assigned_to: number;

  @ManyToOne(() => ManufacturingOrder, { nullable: true })
  @JoinColumn({ name: "parent_order_id" })
  parentOrder: ManufacturingOrder;

  @Column({ nullable: true })
  parent_order_id: number;

  @OneToMany(() => ManufacturingOrderOperation, operation => operation.manufacturingOrder)
  operations: ManufacturingOrderOperation[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

