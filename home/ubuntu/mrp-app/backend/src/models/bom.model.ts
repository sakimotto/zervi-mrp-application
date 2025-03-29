import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Division } from "./division.model";
import { Item } from "./item.model";

@Entity("boms")
export class Bom {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Division)
  @JoinColumn({ name: "division_id" })
  division: Division;

  @Column()
  division_id: number;

  @ManyToOne(() => Item)
  @JoinColumn({ name: "item_id" })
  item: Item;

  @Column()
  item_id: number;

  @Column()
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column()
  version: string;

  @Column({
    type: "enum",
    enum: ["top_level", "intermediate", "lowest_level"],
    default: "top_level"
  })
  bom_level: string;

  @Column({
    type: "enum",
    enum: ["draft", "active", "obsolete"],
    default: "draft"
  })
  status: string;

  @Column({ type: "date" })
  effective_date: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
