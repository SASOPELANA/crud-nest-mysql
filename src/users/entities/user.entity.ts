import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 200, nullable: false })
  name!: string;

  @Column({ length: 200, unique: true, nullable: false })
  email!: string;

  @Column({ nullable: false })
  password!: string;

  @Column({ default: 'user' })
  rol!: string;

  @CreateDateColumn()
  createAt!: Date;

  @UpdateDateColumn()
  updateAt!: Date;

  @DeleteDateColumn()
  deleteAt!: Date | null;
}
