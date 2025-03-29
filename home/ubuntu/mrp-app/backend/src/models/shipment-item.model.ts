import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Shipment } from "./shipment.model";
import { CustomerOrderItem } from "./customer-order-item.model";
import { Item } from "./item.model";
import { UnitOfMeasurement } from "./unit-of-measurement.model";
import { LotTracking } from "./lot-tracking.model";
import { Warehouse } from "./warehouse.model";
import { StorageLocation } from "./storage-location.model";

@Entity("shipment_items")
export class ShipmentItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Shipment)
  @JoinColumn({ name: "shipment_id" })
  shipment: Shipment;

  @Column()
  shipment_id: number;

  @ManyToOne(() => CustomerOrderItem)
  @JoinColumn({ name: "customer_order_item_id" })
  customer_order_item: CustomerOrderItem;

  @Column()
  customer_order_item_id: number;

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

  @ManyToOne(() => LotTracking, { nullable: true })
  @JoinColumn({ name: "lot_id" })
  lot: LotTracking;

  @Column({ nullable: true })
  lot_id: number;

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

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
