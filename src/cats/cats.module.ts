import { Module } from '@nestjs/common';
import { CatsService } from './cats.service';
import { CatsController } from './cats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

// importamos la entidad de la base de datos
import { Cat } from './entities/cat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cat])], // Importamos la entidad para su habilitación
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {}
