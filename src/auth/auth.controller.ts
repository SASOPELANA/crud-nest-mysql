import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/resgister.dto';
import { LoginDto } from './dto/login.dto';
import type { RequestWithUser } from './interfaces/request.auth';
import { Role } from '../common/enums/rol.enum';
import { Auth } from './decorators/auth.decorator';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  @Auth(Role.USER) // USAMOS EL DECORADOR PERSONALIZADO PARA PROTEGER EL ENDPOINT DE PROFILE SOLO PARA USUARIOS CON ROL ADMIN
  getProfile(@Request() req: RequestWithUser) {
    return this.authService.profile(req.user);
  }
}
