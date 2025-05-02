import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToOne, Index } from "typeorm";
import { Item } from "./item.model";
import { LotTracking } from "./lot-tracking.model";

/**
 * Serial Number Entity
 * 
 * Represents individual serialized inventory items.
 * Used for tracking individual units that require unique identification.
 */
@Entity("serial_numbers")
@Index(["serialNumber"])
export class SerialNumber {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "serial_number", length: 100 })
  serialNumber: string;

  @ManyToOne(() => Item, item => item.serialNumbers)
  @JoinColumn({ name: "item_id" })
  item: Item;

  @ManyToOne(() => LotTracking, lot => lot.serialNumbers, { nullable: true })
  @JoinColumn({ name: "lot_id" })
  lot: LotTracking;

  @Column({ length: 50, default: "available" })
  status: string; // 'available', 'sold', 'reserved', 'defective'

  @Column({ length: 255, nullable: true })
  location: string;

  @Column({ type: "text", nullable: true })
  notes: string;

  // Using string references to avoid circular dependencies
  @OneToOne("FabricRoll", "serialNumber", { nullable: true })
  fabricRoll: any;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
