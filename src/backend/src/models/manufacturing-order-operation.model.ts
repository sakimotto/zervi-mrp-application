import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("manufacturing_order_operations")
export class ManufacturingOrderOperation {
  @PrimaryGeneratedColumn()
  id: number;

  // Add more fields here as needed for your application
  @Column({ nullable: true })
  name: string;
}
