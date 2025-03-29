import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Operation } from "./operation.model";

@Entity("embroidery_operations")
export class EmbroideryOperation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Operation)
  @JoinColumn({ name: "operation_id" })
  operation: Operation;

  @Column()
  operation_id: number;

  @Column({ nullable: true })
  design_id: string;

  @Column({ type: "integer", nullable: true })
  stitch_count: number;

  @Column({ type: "integer", nullable: true })
  thread_colors: number;

  @Column({ nullable: true })
  backing_type: string;

  @Column({ nullable: true })
  hoop_size: string;

  @Column({ type: "text", nullable: true })
  special_instructions: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
