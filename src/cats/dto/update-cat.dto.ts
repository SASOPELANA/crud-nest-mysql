// Este dto toma todos los campos de createCatDto y los pone como opcionales en el método updatePartial o donde se utilice
// Sirve para método PATCH --> actualizar datos parciales de un campo
// Si creo un dato en createCatDto, puedo actualizarlo en updateCatDto

import { PartialType } from '@nestjs/swagger';
import { CreateCatDto } from './create-cat.dto';

export class UpdateCatDto extends PartialType(CreateCatDto) {}
