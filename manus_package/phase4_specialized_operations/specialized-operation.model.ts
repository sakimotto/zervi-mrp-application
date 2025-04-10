// Placeholder for specialized-operation.model.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { ManufacturingOrderOperation } from "./manufacturing-order-operation.model";
import { User } from "./user.model";

/**
 * Specialized Operation Entity
 * 
 * Represents specialized manufacturing operations in the Zervi MRP system.
 * These operations extend the basic manufacturing operations with industry-specific parameters.
 */
@Entity("specialized_operations")
export class SpecializedOperation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ManufacturingOrderOperation)
  @JoinColumn({ name: "operation_id" })
  operation: ManufacturingOrderOperation;

  @Column()
  operation_id: number;

  @Column({
    type: "enum",
    enum: ["cutting", "sewing", "laminating", "quality_check", "packaging", "other"],
    default: "other"
  })
  operation_type: string;

  @Column({ type: "jsonb", nullable: true })
  parameters: any;

  @Column({ type: "jsonb", nullable: true })
  equipment_settings: any;

  @Column({ nullable: true })
  equipment_id: string;

  @Column({ nullable: true })
  workstation_id: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "performed_by" })
  performedBy: User;

  @Column({ nullable: true })
  performed_by: number;

  @Column({ type: "timestamp", nullable: true })
  start_time: Date;

  @Column({ type: "timestamp", nullable: true })
  end_time: Date;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  duration_minutes: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  quantity_processed: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  quantity_rejected: number;

  @Column({ type: "text", nullable: true })
  rejection_reason: string;

  @Column({ type: "jsonb", nullable: true })
  quality_metrics: any;

  @Column({ type: "text", nullable: true })
  notes: string;

  @Column({ default: false })
  is_completed: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Helper methods to handle specialized operation types
  static getCuttingDefaults() {
    return {
      parameters: {
        material_type: "",
        pattern_id: "",
        cut_width_mm: 0,
        cut_length_mm: 0,
        layers: 1,
        blade_type: "standard",
        cutting_speed: "medium"
      },
      equipment_settings: {
        blade_pressure: 0,
        blade_angle: 0,
        feed_rate: 0
      }
    };
  }

  static getSewingDefaults() {
    return {
      parameters: {
        stitch_type: "straight",
        stitch_length_mm: 2.5,
        thread_type: "",
        needle_size: "",
        seam_type: "standard"
      },
      equipment_settings: {
        tension: 5,
        speed: "medium",
        presser_foot_pressure: "medium"
      }
    };
  }

  static getLaminatingDefaults() {
    return {
      parameters: {
        adhesive_type: "",
        temperature_celsius: 0,
        pressure_bar: 0,
        dwell_time_seconds: 0,
        material_layers: []
      },
      equipment_settings: {
        heat_zone_1: 0,
        heat_zone_2: 0,
        heat_zone_3: 0,
        roller_pressure: 0,
        speed_m_min: 0
      }
    };
  }

  static getQualityCheckDefaults() {
    return {
      parameters: {
        inspection_points: [],
        acceptance_criteria: {},
        sampling_rate: "100%"
      },
      quality_metrics: {
        visual_inspection: "pass",
        measurements: {},
        defects_found: 0,
        overall_rating: "acceptable"
      }
    };
  }
}

