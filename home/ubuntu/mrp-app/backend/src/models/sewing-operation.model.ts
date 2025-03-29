import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Operation } from "./operation.model";

@Entity("sewing_operations")
export class SewingOperation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Operation)
  @JoinColumn({ name: "operation_id" })
  operation: Operation;

  @Column()
  operation_id: number;

  @Column({ nullable: true })
  stitch_type: string;

  @Column({ type: "decimal", precision: 6, scale: 2, nullable: true })
  stitch_density: number;

  @Column({ nullable: true })
  thread_type: string;

  @Column({ nullable: true })
  needle_size: string;

  @Column({ nullable: true })
  seam_type: string;

  @Column({ type: "text", nullable: true })
  special_instructions: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
