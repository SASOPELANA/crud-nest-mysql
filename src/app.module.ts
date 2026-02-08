import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// hablitar variables de entorno con nest
import { ConfigModule } from '@nestjs/config';

// Importamos el LoggerMiddleware para ver los HTTP por consola.
import { LoggerMiddleware } from './utils/logger/logger/logger.middleware';

// Importamos el AppService y AppController. De los src/*
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { CatsModule } from './cats/cats.module';

@Module({
  // Habilitar varibales de entorno con nest
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Habilitar variables de entorno en toda la app
    CatsModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost', // 'localhost' porque Nest corre fuera del contenedor
      port: 3306,
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      autoLoadEntities: true, // Busca automáticamente archivos .entity.ts
      synchronize: true, // Crea las tablas automáticamente (solo desarrollo)
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Aplicamos el LoggerMiddleware a todas las rutas para ver los HTTP por consola.
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
