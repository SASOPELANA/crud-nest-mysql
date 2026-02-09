import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { Cat } from './entities/cat.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CatsService {
  // Inyectamos el repositorio --> lo usaremos para interactuar con la base de datos -> Cat
  constructor(@InjectRepository(Cat) private catsRepository: Repository<Cat>) {}

  //TODO:  Método POST
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

    const cat = this.catsRepository.create(createCatDto);
    const resCat = await this.catsRepository.save(cat);

    if (!resCat) {
      throw new NotFoundException('No se pudo agregar el gatito a la lista.');
    }

    return resCat;
  }

  //TODO: Metodo GET ALL
  async findAll() {
    const resCats = await this.catsRepository.find();

    if (resCats.length === 0) {
      throw new NotFoundException(
        'No se encontraron gatitos en la base de datos.',
      );
    }

    return resCats;
  }

  //TODO: Método GET BY ID
  async findOne(id: number) {
    const resIdCat = await this.catsRepository.findOneBy({ id });

    if (!resIdCat) {
      throw new NotFoundException(
        `No se pudo encontrar el gatito por ID: ${id}`,
      );
    }

    return resIdCat;
  }

  //TODO: Métodos PATCH --> Actualizar los campos parciales
  // Aquí se usa el dto --> updateCatDto --> EL cual deja los campos opcionales
  // Recomendado usar el preload para un update completo a nivel entidad
  // preload garantiza update semántico a nivel entidad
  // actualiza todos los campos y la fecha (updatedAt) en la DB
  async updateCatPartial(id: number, updateCatDto: UpdateCatDto) {
    // Buscamos si ESTE gato (ID) ya tiene esos mismos datos
    const catDateExists = await this.catsRepository.findOne({
      where: {
        id, // Buscamos por el mismo ID
        ...updateCatDto,
      },
    });

    // Si existe, significa que no hay nada nuevo que cambiar
    if (catDateExists) {
      throw new ConflictException({
        message: 'No hay cambios detectados',
        detail: 'Este gato ya tiene exactamente esa misma información.',
      });
    }

    const cat = await this.catsRepository.preload({
      id,
      ...updateCatDto,
    });

    if (!cat) {
      throw new NotFoundException(`El gato con id ${id} no existe`);
    }

    return await this.catsRepository.save(cat);
  }

  //TODO: Método PUT --> Actualizar todos los campos
  // Recomendado usar el preload para un update completo a nivel entidad
  // preload garantiza update semántico a nivel entidad
  // actualiza todos los campos y la fecha (updatedAt) en la DB
  async updateCat(id: number, updateAllCatDto: CreateCatDto) {
    // Buscamos si ESTE gato (ID) ya tiene esos mismos datos
    const catDateExists = await this.catsRepository.findOne({
      where: {
        id, // Buscamos por el mismo ID
        ...updateAllCatDto,
      },
    });

    // Si existe, significa que no hay nada nuevo que cambiar
    if (catDateExists) {
      throw new ConflictException({
        message: 'No hay cambios detectados',
        detail: 'Este gato ya tiene exactamente esa misma información.',
      });
    }

    const cat = await this.catsRepository.preload({
      id,
      ...updateAllCatDto,
    });

    if (!cat) {
      throw new NotFoundException(`El gato con id ${id} no existe`);
    }

    return await this.catsRepository.save(cat);
  }

  //TODO: Método DELETE
  async remove(id: number) {
    // validamos que existe el gato en la base de datos
    const cat = await this.catsRepository.findOneBy({ id });

    if (!cat) {
      throw new NotFoundException(`El gato con el ID: ${id} no existe.`);
    }

    // Eliminación lógica con typeorm soft delete --> deja la fecha de eliminación en la base de datos, definida en la entidad
    await this.catsRepository.softDelete({ id });

    return { message: `El gato con el ID: ${id} ha sido eliminado.` };
  }
}
