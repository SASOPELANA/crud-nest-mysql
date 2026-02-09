import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
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

  private readonly logger = new Logger('CatsService');

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
        'Error en la base de datos.',
      );
    }
  }

  //TODO: Metodo GET ALL
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
        'Error en la base de datos.',
      );
    }
  }

  //TODO: Método GET BY ID
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

  //TODO: Métodos PATCH --> Actualizar los campos parciales
  // Aquí se usa el dto --> updateCatDto --> EL cual deja los campos opcionales
  // Recomendado usar el preload para un update completo a nivel entidad
  // preload garantiza update semántico a nivel entidad
  //  actualiza todos los campos y la fecha (updatedAt) en la DB
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

    try {
      return await this.catsRepository.save(cat);
    } catch (error) {
      this.handleDBException(error);
    }
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

    try {
      return await this.catsRepository.save(cat);
    } catch (error) {
      this.handleDBException(error);
    }
  }

  // Método centralizado para errores
  // Opcional para manejar los errores de la base de datos
  // Nest de por si mismo maneja los errores de la base de datos
  private handleDBException(error: any) {
    const dbError = error as { code?: string };

    // codigo de error de postgres --> 23505 --> duplicate
    // codigo de error de mysql --> 1062 --> duplicate
    // codigo de error de sql server --> 2627 --> duplicate
    // codigo de errro de mongo --> 11000 --> duplicate
    if (dbError.code === '1062') {
      throw new BadRequestException('Ya existe un registro con esos datos');
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Error inesperado del servidor');
  }

  //TODO: Método DELETE
  async remove(id: number) {
    try {
      // validamos que existe el gato en la base de datos
      const cat = await this.catsRepository.findOneBy({ id });

      if (!cat) {
        throw new NotFoundException(`El gato con el ID: ${id} no existe.`);
      }

      // Eliminación lógica con typeorm soft delete --> deja la fecha de eliminación en la base de datos, definida en la entidad
      await this.catsRepository.softDelete({ id });

      return { message: `El gato con el ID: ${id} ha sido eliminado.` };
    } catch (e) {
      if (e instanceof NotFoundException) throw e;
      throw new InternalServerErrorException('Error en la base de datos.');
    }
  }
}
