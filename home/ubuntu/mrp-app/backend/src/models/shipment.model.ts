import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Division } from "./division.model";
import { CustomerOrder } from "./customer-order.model";
import { User } from "./user.model";

@Entity("shipments")
export class Shipment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Division)
  @JoinColumn({ name: "division_id" })
  division: Division;

  @Column()
  division_id: number;

  @Column()
  shipment_number: string;

  @ManyToOne(() => CustomerOrder)
  @JoinColumn({ name: "customer_order_id" })
  customer_order: CustomerOrder;

  @Column()
  customer_order_id: number;

  @Column({ type: "date" })
  shipment_date: Date;

  @Column({ nullable: true })
  carrier: string;

  @Column({ nullable: true })
  tracking_number: string;

  @Column({
    type: "enum",
    enum: ["pending", "shipped", "delivered"],
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
