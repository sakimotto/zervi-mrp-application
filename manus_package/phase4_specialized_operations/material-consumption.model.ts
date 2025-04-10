// Placeholder for material-consumption.model.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { SpecializedOperation } from "./specialized-operation.model";
import { Item } from "./item.model";

/**
 * Material Consumption Entity
 * 
 * Represents material consumption during specialized operations in the Zervi MRP system.
 * Tracks actual material usage, waste, and efficiency metrics.
 */
@Entity("material_consumptions")
export class MaterialConsumption {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => SpecializedOperation)
  @JoinColumn({ name: "specialized_operation_id" })
  specializedOperation: SpecializedOperation;

  @Column()
  specialized_operation_id: number;

  @ManyToOne(() => Item)
  @JoinColumn({ name: "item_id" })
  item: Item;

  @Column()
  item_id: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  planned_quantity: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  actual_quantity: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  waste_quantity: number;

  @Column({ type: "decimal", precision: 5, scale: 2, default: 0 })
  efficiency_percentage: number;

  @Column({ type: "text", nullable: true })
  notes: string;

  @Column({ type: "timestamp", nullable: true })
  consumption_time: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

