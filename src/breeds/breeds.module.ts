import { Module } from '@nestjs/common';
import { BreedsService } from './breeds.service';
import { BreedsController } from './breeds.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Breed } from './entities/breed.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Breed])], // Importamos la entidad para su habilitación
  controllers: [BreedsController],
  providers: [BreedsService],
  exports: [TypeOrmModule], // Exportamos el módulo para que pueda ser utilizado en otros módulos, como CatsModule
})
export class BreedsModule {}
