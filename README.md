# API REST con NestJS, TypeScript, Docker con MySQL

## Descripción

En este proyecto decidí usar NestJS para tener una API REST con TypeScript, motivo de estar mejor organizado y tener una mejor estructura del proyecto, usando arquitectura monolítica modular, con la carpeta src con los modulos, controllers, services, dtos, types, etc. Para la gestion de la base de datos use TypeORM, Docker para tener un contenedor con MySQL, y para tener una documentación legible y fácil de entender la API use Swagger para probar los endpoints.

Uso de API REST [https://cataas.com](https://cataas.com) para renderizar imagenes en el modo desarrolo.

Configuración de variables de entorno con el paquete `@nestjs/config` para tener una mejor gestión de las variables de entorno para credenciales y informacion sensible como password, bases de datos, tokens, confiruacion de entorno, y para la validación de los DTOs use el paquete `class-validator` y `class-transformer` para tener una validación mas robusta y fácil de usar.

TypeORM `typeorm` es definitivamente el mapeador relacional de objetos (ORM) más maduro disponible en el mundo node.js. Ya que está escrito en TypeScript, funciona bastante bien con el marco Nest.

Guia a través de la documentación Oficial de NestJS. Para una mejor experiencia de desarrollo y buenas prácticas.

## Pre rquisitos para correr el proyecto

- Node.js (version 18 o superior)
- pnpm o elegir el gestor de preferencia npm o yarn
- Docker (para correr el contenedor de MySQL)
- Git (para manejar las versiones del proyecto y su repositorio remoto)

## Instalacion

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

## TypeORM Patron de Repositorio (Repository Pattern)

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

## Metodos de la API

### Gatos

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
