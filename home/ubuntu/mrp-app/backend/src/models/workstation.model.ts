import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Division } from "./division.model";

@Entity("workstations")
export class Workstation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Division)
  @JoinColumn({ name: "division_id" })
  division: Division;

  @Column()
  division_id: number;

  @Column()
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({
    type: "enum",
    enum: ["general", "laminating", "cutting", "sewing", "embroidery"],
    default: "general"
  })
  workstation_type: string;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  capacity_per_hour: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  hourly_rate: number;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
