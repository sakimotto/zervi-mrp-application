import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Routing } from "./routing.model";
import { Workstation } from "./workstation.model";

@Entity("operations")
export class Operation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Routing)
  @JoinColumn({ name: "routing_id" })
  routing: Routing;

  @Column()
  routing_id: number;

  @Column()
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

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

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  setup_time: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  run_time: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  queue_time: number;

  @Column({ default: 0 })
  sequence: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
