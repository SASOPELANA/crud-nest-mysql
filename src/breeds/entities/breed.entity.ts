import { Cat } from 'src/cats/entities/cat.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Breed {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 80 })
  name!: string;

  @OneToMany(() => Cat, (cat) => cat.breed)
  cats!: Cat[];
}
