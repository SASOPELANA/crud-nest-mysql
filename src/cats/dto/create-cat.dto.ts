import {
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';

export class CreateCatDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsInt()
  @IsPositive()
  age: number;

  @IsString()
  @MinLength(6)
  description: string;

  @IsString()
  @IsOptional()
  @MinLength(3)
  breed?: string;

  @IsString()
  @IsUrl()
  image: string;
}
