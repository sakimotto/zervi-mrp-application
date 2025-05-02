import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from "typeorm";
import { Item } from "./item.model";

/**
 * Item Attribute Entity
 * 
 * Represents custom attributes/properties for inventory items.
 * Allows for flexible, extensible item properties beyond the standard fields.
 */
@Entity("item_attributes")
@Index(["attributeName"])
export class ItemAttribute {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Item)
  @JoinColumn({ name: "item_id" })
  item: Item;

  @Column({ name: "attribute_name", length: 100 })
  attributeName: string;

  @Column({ name: "attribute_value", type: "text" })
  attributeValue: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}