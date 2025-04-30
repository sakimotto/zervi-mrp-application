import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToOne } from "typeorm";
import { LotTracking } from "./lot-tracking.model";
import { SerialNumber } from "./serial-number.model";

/**
 * Fabric Roll Entity
 * 
 * Represents specialized tracking for fabric rolls with split functionality.
 * This entity supports the specialized fabric tracking features of the Zervi MRP system.
 */
@Entity("fabric_rolls")
export class FabricRoll {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => LotTracking, lot => lot.fabricRolls)
  @JoinColumn({ name: "lot_id" })
  lot: LotTracking;

  @OneToOne(() => SerialNumber, serialNumber => serialNumber.fabricRoll)
  @JoinColumn({ name: "serial_number_id" })
  serialNumber: SerialNumber;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  quantity: number;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  width: number;

  @Column({ length: 50, default: "In Stock" })
  status: string; // 'In Stock', 'Reserved', 'Used', etc.

  @Column({ length: 255, nullable: true })
  location: string;

  @Column({ type: "text", nullable: true })
  notes: string;

  // Using string references to avoid circular dependencies
  @ManyToOne("FabricRoll", { nullable: true })
  @JoinColumn({ name: "parent_roll_id" })
  parentRoll: any;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
