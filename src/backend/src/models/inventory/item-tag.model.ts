import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from "typeorm";
import { Item } from "./item.model";

/**
 * Item Tag Entity
 * 
 * Represents tags that can be assigned to inventory items.
 * Used for flexible categorization and filtering.
 */
@Entity("item_tags")
export class ItemTag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  name: string;

  @Column({ length: 50, nullable: true })
  color: string;

  @ManyToMany(() => Item)
  @JoinTable({
    name: "item_tag_assignments",
    joinColumn: {
      name: "tag_id",
      referencedColumnName: "id"
    },
    inverseJoinColumn: {
      name: "item_id",
      referencedColumnName: "id"
    }
  })
  items: Item[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}