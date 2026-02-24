// NO hacemos validación de los datos, por eso no usamos class-validator
// No hacemos uso del controlador, por eso no usamos class-validator por ahora
export class CreateUserDto {
  email!: string;
  name!: string;
  password!: string;
}
