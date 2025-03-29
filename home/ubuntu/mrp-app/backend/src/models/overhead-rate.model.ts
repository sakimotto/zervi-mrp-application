import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Division } from "./division.model";
import { CostType } from "./cost-type.model";
import { Currency } from "./currency.model";
import { CostCenter } from "./cost-center.model";

@Entity("overhead_rates")
export class OverheadRate {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Division)
  @JoinColumn({ name: "division_id" })
  division: Division;

  @Column()
  division_id: number;

  @ManyToOne(() => CostCenter)
  @JoinColumn({ name: "cost_center_id" })
  cost_center: CostCenter;

  @Column()
  cost_center_id: number;

  @Column({
    type: "enum",
    enum: ["fixed", "variable", "direct", "indirect"],
    default: "fixed"
  })
  overhead_type: string;

  @Column({
    type: "enum",
    enum: ["labor_hours", "machine_hours", "direct_cost"],
    default: "labor_hours"
  })
  allocation_base: string;

  @Column({ type: "decimal", precision: 10, scale: 4 })
  rate_amount: number;

  @ManyToOne(() => Currency)
  @JoinColumn({ name: "currency_id" })
  currency: Currency;

  @Column()
  currency_id: number;

  @Column({ type: "date" })
  effective_date: Date;

  @Column({ type: "date", nullable: true })
  expiry_date: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
