import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Division } from "./division.model";
import { Supplier } from "./supplier.model";
import { User } from "./user.model";

@Entity("purchase_orders")
export class PurchaseOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Division)
  @JoinColumn({ name: "division_id" })
  division: Division;

  @Column()
  division_id: number;

  @Column()
  order_number: string;

  @ManyToOne(() => Supplier)
  @JoinColumn({ name: "supplier_id" })
  supplier: Supplier;

  @Column()
  supplier_id: number;

  @Column({ type: "date" })
  order_date: Date;

  @Column({ type: "date" })
  expected_delivery_date: Date;

  @Column({
    type: "enum",
    enum: ["draft", "sent", "partially_received", "received", "cancelled"],
    default: "draft"
  })
  status: string;

  @Column({
    type: "enum",
    enum: ["pending", "partial", "paid"],
    default: "pending"
  })
  payment_status: string;

  @Column({ type: "text", nullable: true })
  shipping_address: string;

  @Column({ type: "decimal", precision: 15, scale: 4, default: 0 })
  total_amount: number;

  @Column({ default: "USD" })
  currency: string;

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
