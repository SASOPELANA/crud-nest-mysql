// Aqui las entidades de la base de datos, en este caso la entidad del gato, con sus respectivos campos y tipos de datos.
// Para trabajar con ls db se usar el archivo cat.entity.ts
// El "!" indica a TS que TypeORM asignará este valor (Definite Assignment Assertion)

/** * El signo "!" evita el error de inicialización, ya que TypeORM
 * inyecta el valor al consultar la base de datos.
 */

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Cat {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 80 })
  name!: string;

  @Column('int')
  age!: number;

  @Column()
  description!: string;

  @Column()
  breed!: string;

  @Column()
  image!: string;

  @CreateDateColumn()
  createAt!: Date;

  @UpdateDateColumn()
  updateAt!: Date;

  @DeleteDateColumn()
  deleteAt!: Date | null;
}
