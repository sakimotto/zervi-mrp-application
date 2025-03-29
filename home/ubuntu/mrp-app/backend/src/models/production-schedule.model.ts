import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Division } from "./division.model";
import { Workstation } from "./workstation.model";
import { ManufacturingOrderOperation } from "./manufacturing-order-operation.model";

@Entity("production_schedules")
export class ProductionSchedule {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Division)
  @JoinColumn({ name: "division_id" })
  division: Division;

  @Column()
  division_id: number;

  @ManyToOne(() => Workstation)
  @JoinColumn({ name: "workstation_id" })
  workstation: Workstation;

  @Column()
  workstation_id: number;

  @ManyToOne(() => ManufacturingOrderOperation)
  @JoinColumn({ name: "manufacturing_order_operation_id" })
  manufacturing_order_operation: ManufacturingOrderOperation;

  @Column()
  manufacturing_order_operation_id: number;

  @Column({ type: "timestamp" })
  start_time: Date;

  @Column({ type: "timestamp" })
  end_time: Date;

  @Column({
    type: "enum",
    enum: ["scheduled", "in_progress", "completed", "cancelled"],
    default: "scheduled"
  })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
