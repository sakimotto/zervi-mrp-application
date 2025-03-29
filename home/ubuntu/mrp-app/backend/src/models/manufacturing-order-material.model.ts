import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { ManufacturingOrder } from "./manufacturing-order.model";
import { Item } from "./item.model";
import { BomComponent } from "./bom-component.model";
import { UnitOfMeasurement } from "./unit-of-measurement.model";
import { Warehouse } from "./warehouse.model";
import { StorageLocation } from "./storage-location.model";
import { LotTracking } from "./lot-tracking.model";

@Entity("manufacturing_order_materials")
export class ManufacturingOrderMaterial {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ManufacturingOrder)
  @JoinColumn({ name: "manufacturing_order_id" })
  manufacturing_order: ManufacturingOrder;

  @Column()
  manufacturing_order_id: number;

  @ManyToOne(() => Item)
  @JoinColumn({ name: "item_id" })
  item: Item;

  @Column()
  item_id: number;

  @ManyToOne(() => BomComponent)
  @JoinColumn({ name: "bom_component_id" })
  bom_component: BomComponent;

  @Column()
  bom_component_id: number;

  @Column({ type: "decimal", precision: 15, scale: 4 })
  planned_quantity: number;

  @Column({ type: "decimal", precision: 15, scale: 4, default: 0 })
  issued_quantity: number;

  @Column({ type: "decimal", precision: 15, scale: 4, default: 0 })
  returned_quantity: number;

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
