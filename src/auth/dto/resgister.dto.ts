import { IsEmail, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class RegisterDto {
  @Transform(({ value }: { value: string }) => value.trim())
  @IsString()
  @MinLength(1)
  name!: string;

  @IsEmail()
  email!: string;

  @Transform(({ value }: { value: string }) => value.trim()) // Elimina espacios en blanco al inicio y al final --> ejecuta primero
  @IsString()
  @MinLength(6)
  password!: string;
}
