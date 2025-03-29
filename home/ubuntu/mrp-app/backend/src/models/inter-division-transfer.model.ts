import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Division } from "./division.model";
import { Division as FromDivision } from "./division.model";
import { Division as ToDivision } from "./division.model";
import { User } from "./user.model";

@Entity("inter_division_transfers")
export class InterDivisionTransfer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  transfer_number: string;

  @ManyToOne(() => Division)
  @JoinColumn({ name: "from_division_id" })
  from_division: FromDivision;

  @Column()
  from_division_id: number;

  @ManyToOne(() => Division)
  @JoinColumn({ name: "to_division_id" })
  to_division: ToDivision;

  @Column()
  to_division_id: number;

  @Column({ type: "date" })
  transfer_date: Date;

  @Column({
    type: "enum",
    enum: ["draft", "in_progress", "completed", "cancelled"],
    default: "draft"
  })
  status: string;

  @Column({ type: "text", nullable: true })
  notes: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "created_by" })
  created_by_user: User;

  @Column()
  created_by: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
