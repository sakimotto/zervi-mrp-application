import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Operation } from "./operation.model";

@Entity("laminating_operations")
export class LaminatingOperation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Operation)
  @JoinColumn({ name: "operation_id" })
  operation: Operation;

  @Column()
  operation_id: number;

  @Column({ nullable: true })
  material_type: string;

  @Column({ type: "decimal", precision: 6, scale: 2, nullable: true })
  temperature: number;

  @Column({ type: "decimal", precision: 6, scale: 2, nullable: true })
  pressure: number;

  @Column({ type: "decimal", precision: 6, scale: 2, nullable: true })
  dwell_time: number;

  @Column({ nullable: true })
  adhesive_type: string;

  @Column({ type: "text", nullable: true })
  special_instructions: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
