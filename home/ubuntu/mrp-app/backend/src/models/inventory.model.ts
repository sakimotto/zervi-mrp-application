import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Item } from "./item.model";
import { Warehouse } from "./warehouse.model";
import { StorageLocation } from "./storage-location.model";

@Entity("inventory")
export class Inventory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Item)
  @JoinColumn({ name: "item_id" })
  item: Item;

  @Column()
  item_id: number;

  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: "warehouse_id" })
  warehouse: Warehouse;

  @Column()
  warehouse_id: number;

  @ManyToOne(() => StorageLocation, { nullable: true })
  @JoinColumn({ name: "location_id" })
  location: StorageLocation;

  @Column({ nullable: true })
  location_id: number;

  @Column({ type: "decimal", precision: 15, scale: 4, default: 0 })
  quantity_on_hand: number;

  @Column({ type: "decimal", precision: 15, scale: 4, default: 0 })
  quantity_allocated: number;

  @Column({ type: "decimal", precision: 15, scale: 4, default: 0 })
  quantity_available: number;

  @Column({ nullable: true })
  last_count_date: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
