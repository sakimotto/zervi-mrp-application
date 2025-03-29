import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Operation } from "./operation.model";

@Entity("cutting_operations")
export class CuttingOperation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Operation)
  @JoinColumn({ name: "operation_id" })
  operation: Operation;

  @Column()
  operation_id: number;

  @Column({
    type: "enum",
    enum: ["manual", "cnc", "laser", "die"],
    default: "manual"
  })
  cutting_method: string;

  @Column({ type: "decimal", precision: 6, scale: 2, nullable: true })
  material_thickness: number;

  @Column({ type: "decimal", precision: 6, scale: 2, nullable: true })
  cutting_speed: number;

  @Column({ nullable: true })
  pattern_id: string;

  @Column({ type: "decimal", precision: 5, scale: 2, nullable: true })
  nesting_efficiency: number;

  @Column({ type: "text", nullable: true })
  special_instructions: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
