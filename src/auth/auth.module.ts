import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    // usar registerAsync para poder usar variables de entorno en el secret y cargar el modulo de jwt de forma asincrona,
    //  ya que el secret se carga desde una variable de entorno y no se puede cargar de forma asincrona
    JwtModule.registerAsync({
      global: true, // este global le dice a culquier servicio puede usar jwt sin necesidad de importarlo
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' }, // el token de autenticacion expira en 1 hora
      }),
      inject: [ConfigService],
    }),
  ], // importamos el modulo de users para usar su service en este modulo de auth
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
