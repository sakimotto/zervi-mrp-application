import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Division } from "./division.model";
import { PurchaseOrder } from "./purchase-order.model";
import { User } from "./user.model";

@Entity("goods_receipts")
export class GoodsReceipt {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Division)
  @JoinColumn({ name: "division_id" })
  division: Division;

  @Column()
  division_id: number;

  @Column()
  receipt_number: string;

  @ManyToOne(() => PurchaseOrder)
  @JoinColumn({ name: "purchase_order_id" })
  purchase_order: PurchaseOrder;

  @Column()
  purchase_order_id: number;

  @Column({ type: "date" })
  receipt_date: Date;

  @Column({ nullable: true })
  supplier_delivery_note: string;

  @Column({
    type: "enum",
    enum: ["pending", "received", "quality_check", "stored"],
    default: "pending"
  })
  status: string;

  @Column({ type: "text", nullable: true })
  notes: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "created_by" })
  created_by_user: User;

  @Column()
  created_by: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
