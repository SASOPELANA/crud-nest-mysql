# Métodos de la API

## Lista de Razas

### Agregar una raza a la lista

- **POST** `/api/breeds`
- **Descripción:** Agrega una nueva raza a la lista.
- **Body (JSON):**
- **Content-Type:** application/json

```json
{
  "name": "Siamese"
}
```

- **Respuesta al agregar la nueva raza a la db:**

```json
{
  "id": 1,
  "name": "Siamese"
}
```

### Obtener todas las razas

- **GET** `/api/breeds`
- **Descripción:** Devuelve una lista de todas las razas registradas en la base de datos.
- **Parámetros:** Ninguno.
- **Respuesta de ejemplo:**

```json
[
  {
    "id": 1,
    "name": "bombay"
  },
  {
    "id": 3,
    "name": "siames"
  },
  {
    "id": 4,
    "name": "cute"
  },
  {
    "id": 5,
    "name": "Persian"
  },
  {
    "id": 6,
    "name": "caracal"
  },
  {
    "id": 7,
    "name": "sokoke"
  },
  {
    "id": 8,
    "name": "chinchilla"
  }
]
```

### Obtener raza por ID

- **GET** `/api/breeds/:id`
- **Descripción:** Devuelve una raza específica por su ID.
- **Parámetros:**
  - `id` (path, requerido): ID de la raza.
- **Ejemplo de uso:** `GET /api/breeds/5`
- **Respuesta de ejemplo:**

```json
{
  "id": 5,
  "name": "Persian"
}
```

### Actualizar una raza por ID

- **PATCH** `/api/breeds/:id`
- **Descripción:** Actualiza el nombre de una raza existente por su ID.
- **Parámetros:**
  - `id` (path, requerido): ID de la raza a actualizar.
- **Ejemplo de uso:** `PATCH /api/breeds/5`
- **Body (JSON):**

```json
{
  "name": "Persian Gato"
}
```

- **Respuesta de ejemplo:**

```json
{
  "id": 5,
  "name": "Persian Gato"
}
```

### Eliminar una raza por ID

- **DELETE** `/api/breeds/:id`
- **Descripción:** Elimina una raza de la base de datos por su ID (eliminación lógica).
- **Parámetros:**
  - `id` (path, requerido): ID de la raza a eliminar.
- **Ejemplo de uso:** `DELETE /api/breeds/8`
- **Respuesta de ejemplo:**

```json
{
  "message": "La raza con id 8 ha sido eliminada."
}
```
