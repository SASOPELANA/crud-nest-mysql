# API REST con NestJS, TypeScript, Docker con MySQL

## Descripción

En este proyecto decidí usar NestJS para tener una API REST con TypeScript, motivo de estar mejor organizado y tener una mejor estructura del proyecto, usando arquitectura monolítica modular, con la carpeta src con los módulos, controllers, services, dtos, types, etc. Para la gestión de la base de datos use TypeORM, Docker para tener un contenedor con MySQL, y para tener una documentación legible y fácil de entender la API use Swagger para probar los endpoints.

Uso de API REST [https://cataas.com](https://cataas.com) para renderizar imágenes en el modo desarrollo.

Configuración de variables de entorno con el paquete `@nestjs/config` para tener una mejor gestión de las variables de entorno para credenciales y información sensible como password, bases de datos, tokens, confiruacion de entorno, y para la validación de los DTOs use el paquete `class-validator` y `class-transformer` para tener una validación mas robusta y fácil de usar.

TypeORM `typeorm` es definitivamente el mapeador relacional de objetos (ORM) más maduro disponible en el mundo node.js. Ya que está escrito en TypeScript, funciona bastante bien con el marco Nest.

Guía a través de la documentación Oficial de NestJS. Para una mejor experiencia de desarrollo y buenas prácticas.

## Manejo de Errores con Excepciones HTTP en NestJS

NestJS provee excepciones listas para usar que lanzan automáticamente el status HTTP correcto y formatean la respuesta en JSON.

**Filosofía recomendada**  

- Lanzar excepciones directamente (`throw`) desde **services** (lógica de negocio) o controllers (validaciones simples).  
- **No usar try/catch** salvo que necesites loguear, hacer cleanup o transformar el error.  
- El filtro global de excepciones de NestJS las captura y responde automáticamente.

## Excepciones más usadas y cuándo lanzarlas

| Excepción                        | Status | Cuándo usarla (caso típico)                              | Ejemplo de uso práctico                                      |
|----------------------------------|--------|----------------------------------------------------------|--------------------------------------------------------------|
| `BadRequestException`            | 400    | Datos inválidos, validación fallida, parámetro malo      | Email con formato incorrecto, campo requerido faltante      |
| `UnauthorizedException`          | 401    | No autenticado (sin token, token inválido/expirado)      | Intento de acceso sin JWT válido o credenciales erróneas     |
| `ForbiddenException`             | 403    | Autenticado pero sin permiso (rol insuficiente)          | Usuario "user" intenta eliminar un recurso de "admin"       |
| `NotFoundException`              | 404    | Recurso no existe en la base de datos                    | `GET /users/999` → el usuario con ID 999 no existe           |
| `ConflictException`              | 409    | Conflicto de estado (duplicado, ya existe)               | Registro de usuario con email que ya está en uso             |
| `GoneException`                  | 410    | Recurso existió pero ya no está disponible               | Token de recuperación de contraseña ya expirado/usado       |
| `InternalServerErrorException`   | 500    | Error grave del servidor (usar muy poco manualmente)     | Mejor dejar que errores no manejados suban solos             |

## Ejemplos prácticos

### 1. En un Service (recomendado – lógica de negocio)

```typescript
// src/users/users.service.ts  --> ejemplo de manejo de errores
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(private userRepository: UserRepository) {}

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`El usuario con ID ${id} no existe`);
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    if (!createUserDto.email.includes('@')) {
      throw new BadRequestException('El email debe ser válido');
    }

    const emailExists = await this.userRepository.existsByEmail(createUserDto.email);
    if (emailExists) {
      throw new ConflictException('El email ya está registrado');
    }

    return this.userRepository.save(createUserDto);
  }

  async update(id: number, updateDto: UpdateUserDto, currentUser: User) {
    const user = await this.findOne(id); // ya lanza NotFound si no existe

    if (user.id !== currentUser.id && !currentUser.isAdmin) {
      throw new ForbiddenException('No tienes permiso para modificar este usuario');
    }

    // ... actualizar
  }
}
```

## Pre requisitos para correr el proyecto

- Node.js (version 18 o superior)
- pnpm o elegir el gestor de preferencia npm o yarn
- Docker (para correr el contenedor de MySQL)
- Git (para manejar las versiones del proyecto y su repositorio remoto)

## Instalación

1.Clonar el repositorio remoto en tu maquina local o en tu entorno de desarrollo

2.Instalar pnpm o el gestor de preferencia npm o yarn

```shell
npm install -g pnpm
```

3.Instalar las dependencias del proyecto

```shell
pnpm install
```

4.Configurar las variables de entorno del archivo `.env`, usando la guia del archivo `.env.example`

Variables de entorno requeridas:

- `PORT`: Puerto donde correrá el servidor.

  5.Correr el proyecto en modo desarrollo y el contenedor de MySQL con Docker, usando el archivo `docker-compose.yml` para levantar el contenedor y el servidor.

```shell
docker compose up -d
```

```shell
pnpm run start:dev
```

## Patrón de diseño repositorio (Repository pattern)

El TypeORM soporta el patrón de diseño del repositorio, por lo que cada entidad tiene su propio repositorio. Estos repositorios se pueden obtener de la conexión de base de datos.

El repositorio es encargado de hacer las operaciones en las bases de datos.

## Métodos integrados del Repositorio

Al usar el repositorio de TypeORM, heredas estos métodos sin escribir SQL:

| Método               | Acción SQL Equivalente           | Descripción                                      |
| :------------------- | :------------------------------- | :----------------------------------------------- |
| `.find()`            | `SELECT * FROM table`            | Retorna todos los registros.                     |
| `.findOneBy({ id })` | `SELECT * FROM ... WHERE id = 1` | Busca un registro por su ID o propiedad.         |
| `.save(entity)`      | `INSERT INTO` / `UPDATE`         | Crea o actualiza un registro completo.           |
| `.update(id, data)`  | `UPDATE ... WHERE id = ...`      | Realiza una actualización parcial (eficiente).   |
| `.delete(id)`        | `DELETE FROM ... WHERE id = ...` | Elimina un registro de forma física.             |
| `.softDelete(id)`    | `UPDATE SET deletedAt = NOW()`   | Marcado como borrado (si la entidad lo soporta). |

---

## Características y beneficios del Repository Pattern

- **Abstracción de la fuente de datos:** El patrón de repositorio abstrae el acceso a datos, lo que significa que el código de lógica de negocio no necesita preocuparse por si los datos provienen de una base de datos, una API o cualquier otra fuente.

- **Reutilización de código:** Al proporcionar una interfaz común para acceder a los datos, es más fácil reutilizar el código en diferentes partes de la aplicación.

- **Separación de responsabilidades:** El patrón de repositorio divide claramente las responsabilidades entre la lógica de negocio y la lógica de acceso a datos, lo que facilita el mantenimiento y la comprensión del código.

- **Facilita las pruebas unitarias:** Al utilizar interfaces para representar los repositorios, se pueden crear fácilmente implementaciones de prueba (mocks) para aislar la lógica de negocio durante las pruebas unitarias.

- **Mejora la seguridad:** Al controlar el acceso a los datos a través del patrón de repositorio, es más fácil aplicar controles de acceso y medidas de seguridad.

## TypeORM Patrón de Repositorio (Repository Pattern)

TypeORM admite el patrón de diseño de repositorio, por lo que cada entidad tiene su propio repositorio. Estos repositorios se pueden obtener de la fuente de datos de la base de datos.

`src\cats\entities\cat.entity.ts`

```typescript
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Cat {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 80 })
  name!: string;

  @Column('int')
  age!: number;

  @Column()
  breed!: string;

  @CreateDateColumn()
  createAt!: Date;

  @UpdateDateColumn()
  updateAt!: Date;

  @DeleteDateColumn()
  deleteAt!: Date | null;
}
```

## Métodos de la API

### Lista de Gatos

#### Agregar un gato a la lista

- **POST** `/api/cats`
- **Descripción:** Agrega un gato a la lista.
- **Body (JSON):**

- **Content-Type:** application/json

```json
{
  "name": "El gato con botas",
  "age": 4,
  "breed": "Tabby Naranja",
  "description": "El nombre del gato con botas, solo referencia al personaje.",
  "image": "https://cataas.com/cat/tabby"
}
```

- **Repuesta al agregar al nuevo gato a la db:**

```json
[
  {
    "id": 2,
    "name": "El gato con botas",
    "age": 4,
    "description": "El nombre del gato con botas, solo referencia al personaje.",
    "breed": "Tabby Naranja",
    "image": "https://cataas.com/cat/tabby",
    "createAt": "2026-02-08T03:13:41.882Z",
    "updateAt": "2026-02-08T03:13:41.882Z",
    "deleteAt": null
  }
]
```

#### Obtener todos los gatos

- **GET** `/api/cats`
- **Descripción:** Devuelve una lista de todos los gatos.

```json
[
  {
    "id": 1,
    "name": "El pantera de casa",
    "age": 2,
    "description": "El pantera de casa.",
    "breed": "Bombay",
    "image": "https://cataas.com/cat/black",
    "createAt": "2026-02-08T03:01:26.287Z",
    "updateAt": "2026-02-08T03:01:26.287Z",
    "deleteAt": null
  },
  {
    "id": 2,
    "name": "El gato con botas",
    "age": 4,
    "description": "El nombre del gato con botas, solo referencia al personaje.",
    "breed": "Tabby Naranja",
    "image": "https://cataas.com/cat/tabby",
    "createAt": "2026-02-08T03:13:41.882Z",
    "updateAt": "2026-02-08T03:13:41.882Z",
    "deleteAt": null
  },
  {
    "id": 3,
    "name": "Luna",
    "age": 3,
    "description": "Gato siamés de ojos azules, muy cariñoso y hablador. Tiene el pelaje crema con puntos café oscuro.",
    "breed": "Siamese",
    "image": "https://cataas.com/cat/siamese",
    "createAt": "2026-02-08T03:22:30.172Z",
    "updateAt": "2026-02-08T03:22:30.172Z",
    "deleteAt": null
  }
]
```

#### Obtener gato por ID

- **GET** `/api/cats/:id`
- **Descripción:** Devuelve un gato por su ID.
- **Parámetros:**
  - `id` (path, requerido): ID del gato.
- **Ejemplo de uso:** `api/cats/1`
- **Repuesta de ejemplo:**

```json
[
  {
    "id": 1,
    "name": "El pantera de casa",
    "age": 2,
    "description": "El pantera de casa.",
    "breed": "Bombay",
    "image": "https://cataas.com/cat/black",
    "createAt": "2026-02-08T03:01:26.287Z",
    "updateAt": "2026-02-08T03:01:26.287Z",
    "deleteAt": null
  }
]
```

#### Actualizar parcialmente (PATCH `/api/cats/:id`)

- **PATCH** `/api/cats/:id`
- **Descripción:** Actualiza uno o varios campos de un gato existente. Solo se actualizan los campos incluidos en el body; los demás permanecen igual.
- **Parámetros:** `id` (path, requerido): ID del gato a actualizar.
- **Body (JSON):** (ejemplo con campos parciales)

```json
{
  "age": 5,
  "description": "Ahora es más juguetón y duerme menos."
}
```

- **Respuesta de ejemplo:** objeto del gato actualizado.

```json
{
  "id": 2,
  "name": "El gato con botas",
  "age": 5,
  "description": "Ahora es más juguetón y duerme menos.",
  "breed": "Tabby Naranja",
  "image": "https://cataas.com/cat/tabby",
  "createAt": "2026-02-08T03:13:41.882Z",
  "updateAt": "2026-02-08T03:30:00.000Z",
  "deleteAt": null
}
```

#### Actualizar completamente (PUT `/api/cats/:id`)

- **PUT** `/api/cats/:id`
- **Descripción:** Reemplaza todos los campos del gato con los valores enviados. En un `PUT` deben enviarse todos los campos requeridos por la entidad.
- **Parámetros:** `id` (path, requerido): ID del gato a reemplazar.
- **Body (JSON):** (ejemplo con todos los campos)

```json
{
  "name": "El gato con botas actualizado",
  "age": 5,
  "breed": "Tabby Naranja",
  "description": "Descripción completa actualizada",
  "image": "https://cataas.com/cat/tabby"
}
```

- **Respuesta de ejemplo:** objeto del gato tras el reemplazo completo.

```json
{
  "id": 2,
  "name": "El gato con botas actualizado",
  "age": 5,
  "description": "Descripción completa actualizada",
  "breed": "Tabby Naranja",
  "image": "https://cataas.com/cat/tabby",
  "createAt": "2026-02-08T03:13:41.882Z",
  "updateAt": "2026-02-08T03:30:00.000Z",
  "deleteAt": null
}
```

#### Eliminar un gato de la lista de la db por ID

- **DELETE** `/api/cats/:id`
- **Descripción:** Elimina un gato por su ID.
- **Parámetros:**
  - `id` (path, requerido): ID del gato a eliminar
- **Respuesta:** 204 No Content

```json
[
  {
    `El gato con el ID: 6 ha sido eliminado.`
  }
]
```
