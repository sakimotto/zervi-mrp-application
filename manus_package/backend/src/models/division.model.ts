import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Company } from "./company.model";

/**
 * Division Entity
 * 
 * Represents a division within a company (e.g. Automotive, Camping, Apparel, Zervitek)
 * Divisions are a key organizational unit in the Zervi MRP system.
 */
@Entity("divisions")
export class Division {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "company_id" })
  companyId: number;

  @Column({ length: 255 })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ length: 20, nullable: true })
  code: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  // Define relationship with Company
  @ManyToOne(() => Company)
  @JoinColumn({ name: "company_id" })
  company: Company;
}
