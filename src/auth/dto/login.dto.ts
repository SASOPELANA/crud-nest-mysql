import { Transform } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email!: string;

  @Transform(({ value }: { value: string }) => value.trim()) // Elimina espacios en blanco al inicio y al final --> ejecuta primero
  @IsString()
  @MinLength(6)
  password!: string;
}
