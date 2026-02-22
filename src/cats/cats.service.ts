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
import { Breed } from 'src/breeds/entities/breed.entity';

@Injectable()
export class CatsService {
  // Inyectamos el repositorio --> lo usaremos para interactuar con la base de datos -> Cat
  constructor(
    @InjectRepository(Cat) private readonly catsRepository: Repository<Cat>,
    // Inyectamos el repositorio de Breed para validar la existencia de la raza al crear un gato
    @InjectRepository(Breed)
    private readonly breedRepository: Repository<Breed>,
  ) {}

  //TODO:  Método POST
  async create(createCatDto: CreateCatDto) {
    const breed = await this.breedRepository.findOneBy({
      name: createCatDto.breed,
    });

    if (!breed) {
      throw new NotFoundException('La raza del gato no existe.');
    }

    // Buscamos si ya existe el gato en la db
    const catExists = await this.catsRepository.findOne({
      where: {
        description: createCatDto.description,
        image: createCatDto.image,
        breed: breed, // Usamos la entidad de raza encontrada
      },
    });

    // Si existe, lanzamos un error de Conflicto (409)
    if (catExists) {
      throw new ConflictException({
        message: 'Registro duplicado detectado',
        detail: `Ya existe un gato de raza ${createCatDto.breed} con esta descripción.`,
        submittedImage: createCatDto.image,
      });
    }

    const cat = this.catsRepository.create({
      ...createCatDto,
      breed, // Asignamos la entidad de la raza encontrada
    });
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
    let breed: Breed | undefined;

    // Validamos que el gato exista antes de intentar actualizarlo
    if (updateCatDto.breed) {
      const existBreed = await this.breedRepository.findOneBy({
        name: updateCatDto.breed,
      });

      if (!existBreed) {
        throw new NotFoundException('La raza del gato no existe.');
      }
      breed = existBreed;
    }

    const cat = await this.catsRepository.preload({
      id,
      name: updateCatDto.name,
      age: updateCatDto.age,
      description: updateCatDto.description,
      image: updateCatDto.image,
      ...(breed && { breed }), // Si se proporciona una nueva raza, se actualizará; si no, se mantendrá la existente
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
    const breed = await this.breedRepository.findOneBy({
      name: updateAllCatDto.breed,
    });

    if (!breed) {
      throw new NotFoundException('La raza del gato no existe.');
    }

    const cat = await this.catsRepository.preload({
      id,
      name: updateAllCatDto.name,
      age: updateAllCatDto.age,
      description: updateAllCatDto.description,
      image: updateAllCatDto.image,
      breed,
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
      throw new NotFoundException(`El gato con el id ${id} no existe.`);
    }

    // Eliminación lógica con typeorm soft delete --> deja la fecha de eliminación en la base de datos, definida en la entidad
    await this.catsRepository.softDelete({ id });

    return { message: `El gato con el id ${id} ha sido eliminado.` };
  }
}
