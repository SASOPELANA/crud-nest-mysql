import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBreedDto } from './dto/create-breed.dto';
import { UpdateBreedDto } from './dto/update-breed.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Breed } from './entities/breed.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BreedsService {
  constructor(
    @InjectRepository(Breed)
    private readonly breedRepository: Repository<Breed>,
  ) {}

  // TODO: Método POST
  async create(createBreedDto: CreateBreedDto) {
    const breedExists = await this.breedRepository.findOneBy({
      name: createBreedDto.name,
    });

    if (breedExists) {
      throw new NotFoundException(
        `La raza ${createBreedDto.name} ya existe en la base de datos.`,
      );
    }

    return await this.breedRepository.save(createBreedDto);
  }

  //TODO: Método GET ALL
  async findAll() {
    return await this.breedRepository.find();
  }

  // TODO: Método GET ONE por id
  async findOne(id: number) {
    const existBreedId = await this.breedRepository.findOneBy({ id });

    if (!existBreedId) {
      throw new NotFoundException(`La raza con id ${id} no existe.`);
    }

    return existBreedId;
  }

  // TODO: Método UPDATE por id
  async update(id: number, updateBreedDto: UpdateBreedDto) {
    const existBreedId = await this.breedRepository.findOneBy({
      id,
    });

    if (!existBreedId) {
      throw new NotFoundException(`La raza con id ${id} no existe.`);
    }

    return await this.breedRepository.save({
      ...existBreedId,
      name: updateBreedDto.name,
    });
  }

  // TODO: Método DELETE por id
  async remove(id: number) {
    const existBreedId = await this.breedRepository.findOneBy({ id });

    if (!existBreedId) {
      throw new NotFoundException(`La raza con id ${id} no existe.`);
    }

    // Eliminacion logica, para dejar la fecha de eliminacion en la base de datos, y no eliminar el registro fisicamente
    await this.breedRepository.delete({ id });

    return { message: `La raza con id ${id} ha sido eliminada.` };
  }
}
