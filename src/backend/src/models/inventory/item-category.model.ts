import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Division } from "../division.model";
import { Item } from "./item.model";

/**
 * Item Category Entity
 * 
 * Represents a category for inventory items in the Zervi MRP system.
 * Categories can be hierarchical, with parent-child relationships.
 */
@Entity("item_categories")
export class ItemCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @ManyToOne(() => ItemCategory, category => category.childCategories)
  @JoinColumn({ name: "parent_category_id" })
  parentCategory: ItemCategory;

  @OneToMany(() => ItemCategory, category => category.parentCategory)
  childCategories: ItemCategory[];

  @ManyToOne(() => Division)
  @JoinColumn({ name: "division_id" })
  division: Division;

  @OneToMany(() => Item, item => item.category)
  items: Item[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
