import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

/**
 * User Entity
 * 
 * Represents a user in the Zervi MRP system.
 * Users can be assigned to specific divisions and have different roles.
 */
@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  username: string;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 255, select: false }) // 'select: false' helps hide password in normal queries
  password: string;

  @Column({ length: 255, nullable: true })
  full_name: string;

  @Column({ name: "role_id" })
  roleId: number;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  // Note: In a full implementation, we would define relationships like:
  // @ManyToOne(() => Role)
  // @JoinColumn({ name: "role_id" })
  // role: Role;
}
