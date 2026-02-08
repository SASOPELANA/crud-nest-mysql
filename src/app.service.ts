import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  // Devolver el mensaje de bienvenida con json --> usar object en el type
  index(): object {
    return {
      message: '🔧 Bienvenido a mi API REST con NestJS, TypeScript y MySQL 🌐',
      system: 'Gestión de Gatos 🐱',
      author: 'Sergio Alejandro Sopelana',
      version: '1.0.0',
    };
  }
}
