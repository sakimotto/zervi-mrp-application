import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Bom } from "./bom.model";
import { Item } from "./item.model";
import { UnitOfMeasurement } from "./unit-of-measurement.model";

@Entity("bom_components")
export class BomComponent {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Bom)
  @JoinColumn({ name: "bom_id" })
  bom: Bom;

  @Column()
  bom_id: number;

  @ManyToOne(() => Item)
  @JoinColumn({ name: "component_item_id" })
  component_item: Item;

  @Column()
  component_item_id: number;

  @Column({
    type: "enum",
    enum: ["raw_material", "semi_finished", "finished_product"],
    default: "raw_material"
  })
  component_type: string;

  @Column({ type: "decimal", precision: 15, scale: 4 })
  quantity: number;

  @ManyToOne(() => UnitOfMeasurement)
  @JoinColumn({ name: "uom_id" })
  uom: UnitOfMeasurement;

  @Column()
  uom_id: number;

  @Column({ default: 0 })
  position: number;

  @ManyToOne(() => BomComponent, { nullable: true })
  @JoinColumn({ name: "parent_component_id" })
  parent_component: BomComponent;

  @Column({ nullable: true })
  parent_component_id: number;

  @Column({ default: 0 })
  level_number: number;

  @Column({ type: "text", nullable: true })
  notes: string;

  @Column({ default: false })
  is_critical: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
