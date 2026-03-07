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
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService, // inyectamos el servicio de jwt para generar el token de autenticacion
  ) {}

  async register({ name, email, password }: RegisterDto) {
    const userExist = await this.usersService.findOneByEmail(email);

    if (userExist) {
      throw new BadRequestException('User already exist');
    }

    await this.usersService.create({
      name,
      email,
      password: await bcryptjs.hash(password, 10), // hasheamos la contraseña antes de guardarla en la base de datos
    });

    return {
      name,
      email,
    };
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

    // creamos el payload del token de autenticacion, en este caso solo el email y el role del usuario, pero se pueden agregar mas campos si se desea
    const payload = { email: user.email, role: user.role };

    const token = await this.jwtService.signAsync(payload);

    return {
      token,
    };
  }

  async profile({ email }: { email: string }) {
    //if (role !== 'admin') {
    // throw new UnauthorizedException(
    //   'You are not authorized to access this resource',
    // );
    // }

    return await this.usersService.findOneByEmail(email);
  }
}
