import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';

@Controller('api/cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  // Metodo POST
  @Post()
  create(@Body() createCatDto: CreateCatDto) {
    return this.catsService.create(createCatDto);
  }

  // Metodo GET
  @Get()
  findAll() {
    return this.catsService.findAll();
  }

  // Metodo GET BY ID
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.catsService.findOne(id);
  }

  // Metodo PATCH --> Actualizar los campos parciales
  @Patch(':id')
  updateCatPartial(
    @Param('id') id: number,
    @Body() updateCatDto: UpdateCatDto,
  ) {
    return this.catsService.updateCatPartial(id, updateCatDto);
  }

  // Metodo PUT --> Actualizar todos los campos
  @Put(':id')
  updateCat(@Param('id') id: number, @Body() updateAllCatDto: CreateCatDto) {
    return this.catsService.updateCat(id, updateAllCatDto);
  }

  // Metodo DELETE
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.catsService.remove(id);
  }
}
