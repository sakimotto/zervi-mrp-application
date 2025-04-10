// Placeholder for manufacturing-order-operation.model.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { ManufacturingOrder } from "./manufacturing-order.model";
import { User } from "./user.model";

/**
 * Manufacturing Order Operation Entity
 * 
 * Represents an operation within a manufacturing order in the Zervi MRP system.
 * Operations are sequential steps in the manufacturing process.
 */
@Entity("manufacturing_order_operations")
export class ManufacturingOrderOperation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ManufacturingOrder, order => order.operations)
  @JoinColumn({ name: "manufacturing_order_id" })
  manufacturingOrder: ManufacturingOrder;

  @Column()
  manufacturing_order_id: number;

  @Column()
  operation_number: number;

  @Column()
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({
    type: "enum",
    enum: ["setup", "cutting", "sewing", "laminating", "assembly", "quality_check", "packaging", "other"],
    default: "other"
  })
  operation_type: string;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  planned_hours: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  actual_hours: number;

  @Column({
    type: "enum",
    enum: ["pending", "in_progress", "completed", "on_hold"],
    default: "pending"
  })
  status: string;

  @Column({ type: "date", nullable: true })
  planned_start_date: Date;

  @Column({ type: "date", nullable: true })
  planned_end_date: Date;

  @Column({ type: "date", nullable: true })
  actual_start_date: Date;

  @Column({ type: "date", nullable: true })
  actual_end_date: Date;

  @Column({ type: "text", nullable: true })
  notes: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "assigned_to" })
  assignedTo: User;

  @Column({ nullable: true })
  assigned_to: number;

  @Column({ nullable: true })
  workstation: string;

  @Column({ type: "jsonb", nullable: true })
  operation_parameters: any;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

