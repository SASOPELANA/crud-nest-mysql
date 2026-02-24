import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule], // importamos el modulo de users para usar su service en este modulo de auth
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
