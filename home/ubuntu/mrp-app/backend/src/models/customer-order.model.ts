import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Division } from "./division.model";
import { Customer } from "./customer.model";
import { User } from "./user.model";

@Entity("customer_orders")
export class CustomerOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Division)
  @JoinColumn({ name: "division_id" })
  division: Division;

  @Column()
  division_id: number;

  @Column()
  order_number: string;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: "customer_id" })
  customer: Customer;

  @Column()
  customer_id: number;

  @Column({ type: "date" })
  order_date: Date;

  @Column({ type: "date" })
  required_date: Date;

  @Column({
    type: "enum",
    enum: ["draft", "confirmed", "in_production", "ready_for_shipment", "shipped", "completed", "cancelled"],
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

  @Column({ type: "text", nullable: true })
  billing_address: string;

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
