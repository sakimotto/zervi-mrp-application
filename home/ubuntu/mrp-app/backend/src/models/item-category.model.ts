import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Division } from "./division.model";
import { ItemCategory } from "./item-category.model";

@Entity("item_categories")
export class ItemCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Division)
  @JoinColumn({ name: "division_id" })
  division: Division;

  @Column()
  division_id: number;

  @Column()
  name: string;

  @ManyToOne(() => ItemCategory, { nullable: true })
  @JoinColumn({ name: "parent_category_id" })
  parent_category: ItemCategory;

  @Column({ nullable: true })
  parent_category_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
