import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { ManufacturingOrder } from "./manufacturing-order.model";
import { Operation } from "./operation.model";
import { Workstation } from "./workstation.model";

@Entity("manufacturing_order_operations")
export class ManufacturingOrderOperation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ManufacturingOrder)
  @JoinColumn({ name: "manufacturing_order_id" })
  manufacturing_order: ManufacturingOrder;

  @Column()
  manufacturing_order_id: number;

  @ManyToOne(() => Operation)
  @JoinColumn({ name: "operation_id" })
  operation: Operation;

  @Column()
  operation_id: number;

  @Column({
    type: "enum",
    enum: ["general", "laminating", "cutting", "sewing", "embroidery"],
    default: "general"
  })
  operation_type: string;

  @ManyToOne(() => Workstation)
  @JoinColumn({ name: "workstation_id" })
  workstation: Workstation;

  @Column()
  workstation_id: number;

  @Column({
    type: "enum",
    enum: ["pending", "in_progress", "completed"],
    default: "pending"
  })
  status: string;

  @Column({ type: "timestamp", nullable: true })
  planned_start_date: Date;

  @Column({ type: "timestamp", nullable: true })
  planned_end_date: Date;

  @Column({ type: "timestamp", nullable: true })
  actual_start_date: Date;

  @Column({ type: "timestamp", nullable: true })
  actual_end_date: Date;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  setup_time_actual: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  run_time_actual: number;

  @Column({ type: "decimal", precision: 15, scale: 4, default: 0 })
  quantity_completed: number;

  @Column({ type: "decimal", precision: 15, scale: 4, default: 0 })
  quantity_scrapped: number;

  @Column({ type: "text", nullable: true })
  notes: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
