// Importamos los decoradores de class-validator
// IsInt, IsOptional, IsPositive, IsString, IsUrl, MinLength --> para la validación de datos en el DTO

import {
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Max,
  MinLength,
} from 'class-validator';

export class CreateCatDto {
  @IsString()
  @MinLength(3)
  name!: string;

  @IsInt()
  @IsPositive()
  @Max(20)
  age!: number;

  @IsString()
  @MinLength(6)
  description!: string;

  @IsString()
  @IsOptional()
  @MinLength(3)
  breed?: string;

  @IsString()
  @IsUrl()
  image!: string;
}
