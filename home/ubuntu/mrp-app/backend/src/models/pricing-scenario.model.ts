import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Division } from "./division.model";

@Entity("pricing_scenarios")
export class PricingScenario {
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

  @Column({ type: "decimal", precision: 6, scale: 2, default: 0 })
  markup_percentage: number;

  @Column({ type: "decimal", precision: 6, scale: 2, default: 0 })
  discount_percentage: number;

  @Column({ default: false })
  include_indirect_costs: boolean;

  @Column({
    type: "enum",
    enum: ["draft", "active", "archived"],
    default: "draft"
  })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
