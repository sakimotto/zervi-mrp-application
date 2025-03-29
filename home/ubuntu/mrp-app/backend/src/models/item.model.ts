import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Division } from "./division.model";
import { ItemCategory } from "./item-category.model";
import { UnitOfMeasurement } from "./unit-of-measurement.model";
import { Supplier } from "./supplier.model";

@Entity("items")
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Division)
  @JoinColumn({ name: "division_id" })
  division: Division;

  @Column()
  division_id: number;

  @Column()
  item_code: string;

  @Column()
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({
    type: "enum",
    enum: ["raw_material", "semi_finished", "finished_product"],
    default: "raw_material"
  })
  type: string;

  @ManyToOne(() => ItemCategory)
  @JoinColumn({ name: "category_id" })
  category: ItemCategory;

  @Column()
  category_id: number;

  @ManyToOne(() => UnitOfMeasurement)
  @JoinColumn({ name: "uom_id" })
  uom: UnitOfMeasurement;

  @Column()
  uom_id: number;

  @ManyToOne(() => Supplier, { nullable: true })
  @JoinColumn({ name: "default_supplier_id" })
  default_supplier: Supplier;

  @Column({ nullable: true })
  default_supplier_id: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  min_stock_level: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  reorder_point: number;

  @Column({ default: 0 })
  lead_time_days: number;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
