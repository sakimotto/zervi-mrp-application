import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Item } from "./item.model";

@Entity("lot_tracking")
export class LotTracking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Item)
  @JoinColumn({ name: "item_id" })
  item: Item;

  @Column()
  item_id: number;

  @Column()
  lot_number: string;

  @Column({ type: "date", nullable: true })
  expiry_date: Date;

  @Column({ type: "date", nullable: true })
  manufacturing_date: Date;

  @Column({ type: "decimal", precision: 15, scale: 4 })
  quantity: number;

  @Column({
    type: "enum",
    enum: ["available", "quarantine", "consumed"],
    default: "available"
  })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
