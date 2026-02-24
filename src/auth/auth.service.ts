// Este service se conecta con el otro modulo y debe usar el otros service de users users.service.ts
// por el motivo que users.service.ts tiene los metodos crear y buscar usario por email

import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service'; // importamos el service de users para usarlo en este service de auth
import { RegisterDto } from './dto/resgister.dto';

import * as bcryptjs from 'bcryptjs';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register({ name, email, password }: RegisterDto) {
    const userExist = await this.usersService.findOneByEmail(email);

    if (userExist) {
      throw new BadRequestException('User already exist');
    }
    const newUser = await this.usersService.create({
      name,
      email,
      password: await bcryptjs.hash(password, 10), // hasheamos la contraseña antes de guardarla en la base de datos
    });

    //console.log(newUser);

    return newUser;
  }

  async login({ email, password }: LoginDto) {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Email is wrong');
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Password is wrong');
    }

    return user;
  }
}
