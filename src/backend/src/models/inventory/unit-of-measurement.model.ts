import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from "typeorm";

/**
 * Units of Measurement Entity
 * 
 * Represents units of measurement for inventory items.
 * Supports conversion between units with conversion factors.
 */
@Entity("units_of_measurement")
export class UnitOfMeasurement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 10 })
  abbreviation: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ name: "is_base_unit", default: false })
  isBaseUnit: boolean;

  @Column({ name: "conversion_factor", type: "decimal", precision: 10, scale: 4, default: 1 })
  conversionFactor: number;

  @ManyToOne(() => UnitOfMeasurement, uom => uom.derivedUnits)
  @JoinColumn({ name: "base_unit_id" })
  baseUnit: UnitOfMeasurement;

  @OneToMany(() => UnitOfMeasurement, uom => uom.baseUnit)
  derivedUnits: UnitOfMeasurement[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
