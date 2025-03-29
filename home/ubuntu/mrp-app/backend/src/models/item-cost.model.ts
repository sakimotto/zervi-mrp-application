import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Division } from "./division.model";
import { Item } from "./item.model";
import { CostType } from "./cost-type.model";
import { Currency } from "./currency.model";

@Entity("item_costs")
export class ItemCost {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Item)
  @JoinColumn({ name: "item_id" })
  item: Item;

  @Column()
  item_id: number;

  @ManyToOne(() => CostType)
  @JoinColumn({ name: "cost_type_id" })
  cost_type: CostType;

  @Column()
  cost_type_id: number;

  @Column({ type: "decimal", precision: 15, scale: 4 })
  cost_amount: number;

  @ManyToOne(() => Currency)
  @JoinColumn({ name: "currency_id" })
  currency: Currency;

  @Column()
  currency_id: number;

  @Column({ type: "date" })
  effective_date: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
