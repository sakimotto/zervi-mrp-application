import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { UnitOfMeasurement } from "./unit-of-measurement.model";

@Entity("uom_conversions")
export class UomConversion {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UnitOfMeasurement)
  @JoinColumn({ name: "from_uom_id" })
  from_uom: UnitOfMeasurement;

  @Column()
  from_uom_id: number;

  @ManyToOne(() => UnitOfMeasurement)
  @JoinColumn({ name: "to_uom_id" })
  to_uom: UnitOfMeasurement;

  @Column()
  to_uom_id: number;

  @Column({ type: "decimal", precision: 10, scale: 4 })
  conversion_factor: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
