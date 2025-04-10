// Placeholder for operation-result.model.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { SpecializedOperation } from "./specialized-operation.model";

/**
 * Operation Result Entity
 * 
 * Represents results and measurements from specialized operations in the Zervi MRP system.
 * Stores detailed metrics, test results, and quality data for manufacturing operations.
 */
@Entity("operation_results")
export class OperationResult {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => SpecializedOperation)
  @JoinColumn({ name: "specialized_operation_id" })
  specializedOperation: SpecializedOperation;

  @Column()
  specialized_operation_id: number;

  @Column({ type: "jsonb", nullable: true })
  measurements: any;

  @Column({ type: "jsonb", nullable: true })
  test_results: any;

  @Column({
    type: "enum",
    enum: ["pass", "fail", "conditional_pass", "needs_review"],
    default: "needs_review"
  })
  result_status: string;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  defect_rate: number;

  @Column({ type: "text", nullable: true })
  inspector_notes: string;

  @Column({ type: "jsonb", nullable: true })
  images: any;

  @Column({ type: "jsonb", nullable: true })
  attachments: any;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

