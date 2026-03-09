import { Role } from '../../common/enums/rol.enum';
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

  @Column({ nullable: false, select: false }) // --> select: false --> no se mostrara el password al hacer consultas a la base de datos
  password!: string;

  @Column({ type: 'enum', default: Role.USER, enum: Role })
  role!: Role;

  @CreateDateColumn()
  createAt!: Date;

  @UpdateDateColumn()
  updateAt!: Date;

  @DeleteDateColumn()
  deleteAt!: Date | null;
}
