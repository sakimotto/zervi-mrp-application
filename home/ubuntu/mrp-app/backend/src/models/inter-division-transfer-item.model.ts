import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { InterDivisionTransfer } from "./inter-division-transfer.model";
import { Item } from "./item.model";
import { UnitOfMeasurement } from "./unit-of-measurement.model";
import { Warehouse } from "./warehouse.model";
import { StorageLocation } from "./storage-location.model";
import { LotTracking } from "./lot-tracking.model";

@Entity("inter_division_transfer_items")
export class InterDivisionTransferItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => InterDivisionTransfer)
  @JoinColumn({ name: "inter_division_transfer_id" })
  inter_division_transfer: InterDivisionTransfer;

  @Column()
  inter_division_transfer_id: number;

  @ManyToOne(() => Item)
  @JoinColumn({ name: "item_id" })
  item: Item;

  @Column()
  item_id: number;

  @Column({ type: "decimal", precision: 15, scale: 4 })
  quantity: number;

  @ManyToOne(() => UnitOfMeasurement)
  @JoinColumn({ name: "uom_id" })
  uom: UnitOfMeasurement;

  @Column()
  uom_id: number;

  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: "from_warehouse_id" })
  from_warehouse: Warehouse;

  @Column()
  from_warehouse_id: number;

  @ManyToOne(() => StorageLocation, { nullable: true })
  @JoinColumn({ name: "from_location_id" })
  from_location: StorageLocation;

  @Column({ nullable: true })
  from_location_id: number;

  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: "to_warehouse_id" })
  to_warehouse: Warehouse;

  @Column()
  to_warehouse_id: number;

  @ManyToOne(() => StorageLocation, { nullable: true })
  @JoinColumn({ name: "to_location_id" })
  to_location: StorageLocation;

  @Column({ nullable: true })
  to_location_id: number;

  @ManyToOne(() => LotTracking, { nullable: true })
  @JoinColumn({ name: "lot_id" })
  lot: LotTracking;

  @Column({ nullable: true })
  lot_id: number;

  @Column({
    type: "enum",
    enum: ["pending", "transferred"],
    default: "pending"
  })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
