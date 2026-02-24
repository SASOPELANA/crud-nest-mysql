import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  // metodo para crear un nuevo usuario --> POST
  create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);
  }

  // metodo para obtener un usuario por su email --> GET
  findOneByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  // opcional --> obtenemos todos los usuarios --> GET
  findAll() {
    return `This action returns all users`;
  }

  // opcional --> obtenemos un usuario por su id --> GET
  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
