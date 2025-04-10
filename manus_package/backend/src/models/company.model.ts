import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";

/**
 * Company Entity
 * 
 * Represents a company in the Zervi MRP system.
 * This is a top-level entity in the organizational hierarchy.
 */
@Entity("companies")
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ type: "text", nullable: true })
  address: string;

  @Column({ type: "text", nullable: true })
  contact_info: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  // Note: In a full implementation, we would define relationships like:
  // @OneToMany(() => Division, division => division.company)
  // divisions: Division[];
}
