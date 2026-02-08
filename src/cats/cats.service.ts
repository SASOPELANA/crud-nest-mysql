import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { Cat } from './entities/cat.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CatsService {
  constructor(@InjectRepository(Cat) private catsRepository: Repository<Cat>) {}

  // Metodo POST
  async create(createCatDto: CreateCatDto) {
    // 1. Buscamos si ya existe el gato en la db
    const catExists = await this.catsRepository.findOne({
      where: {
        breed: createCatDto.breed,
        description: createCatDto.description,
        image: createCatDto.image,
      },
    });

    // 2. Si existe, lanzamos un error de Conflicto (409)
    if (catExists) {
      throw new ConflictException({
        message: 'Registro duplicado detectado',
        detail: `Ya existe un gato de raza ${createCatDto.breed} con esta descripción.`,
        submittedImage: createCatDto.image,
      });
    }

    try {
      const cat = this.catsRepository.create(createCatDto);

      const resCat = await this.catsRepository.save(cat);

      if (!resCat) {
        throw new NotFoundException('No se pudo agregar el gatito a la lista.');
      }

      return resCat;
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        'No se pudo agregar el gatito a la lista.',
      );
    }
  }

  // Metodo GET ALL
  async findAll() {
    try {
      const resCats = await this.catsRepository.find();

      if (resCats.length === 0) {
        throw new NotFoundException(
          'No se encontraron gatitos en la base de datos.',
        );
      }

      return resCats;
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        'No se encontraron gatitos en la base de datos.',
      );
    }
  }

  // Metodo GET BY ID
  async findOne(id: number) {
    const resIdCat = await this.catsRepository.findOneBy({ id });

    if (!resIdCat) {
      throw new NotFoundException(
        `No se pudo encontrar el gatito por ID: ${id}`,
      );
    }

    try {
      return resIdCat;
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        'Error en la base de datos.',
      );
    }
  }

  updateCatPartial(id: number, updateCatDto: UpdateCatDto) {
    return `Esta accion actualiza un campo del gatito por ID: ${id}`;
  }

  updateCat(id: number, updateCatDto: UpdateCatDto) {
    return `Esta accion actualiza todos campos del gatito por ID: ${id}`;
  }

  // Metodo DELETE
  async remove(id: number) {
    try {
      // validamos que existe el gato en la base de datos
      const cat = await this.catsRepository.findOneBy({ id });

      if (!cat) {
        throw new NotFoundException(`El gato con el ID: ${id} no existe.`);
      }

      // Eliminacion logica con typeorm soft delete --> deja la fecha de eliminacion en la base de datos, definida en la entidad
      await this.catsRepository.softDelete({ id });

      return { message: `El gato con el ID: ${id} ha sido eliminado.` };
    } catch (e) {
      if (e instanceof NotFoundException) throw e;
      throw new InternalServerErrorException('Error al eliminar el gato de la base de datos.');
    }
  }
}
