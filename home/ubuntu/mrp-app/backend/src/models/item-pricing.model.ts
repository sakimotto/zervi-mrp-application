import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Division } from "./division.model";
import { Item } from "./item.model";
import { PricingScenario } from "./pricing-scenario.model";
import { Currency } from "./currency.model";

@Entity("item_pricing")
export class ItemPricing {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Item)
  @JoinColumn({ name: "item_id" })
  item: Item;

  @Column()
  item_id: number;

  @ManyToOne(() => PricingScenario)
  @JoinColumn({ name: "pricing_scenario_id" })
  pricing_scenario: PricingScenario;

  @Column()
  pricing_scenario_id: number;

  @Column({ type: "decimal", precision: 15, scale: 4 })
  base_cost: number;

  @Column({ type: "decimal", precision: 15, scale: 4 })
  calculated_price: number;

  @Column({ type: "decimal", precision: 15, scale: 4, nullable: true })
  manual_price_override: number;

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
