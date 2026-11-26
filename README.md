# API REST — Recurso Post

Evidencia **GA7-220501096-AA5-EV03 — Diseño y Desarrollo de Servicios Web (API Proyecto)**

- Aprendiz: Daniela Narváez Jiménez
- Programa: Análisis y Desarrollo de Software
- Ficha: 3336115
- Centro de formación: SENA Regional Caldas

---

## 1. Descripción general

API REST construida con **Node.js**, **Express** y **MongoDB** que administra el recurso `Post`.
Expone un conjunto de servicios web que permiten registrar, consultar, actualizar y eliminar
publicaciones almacenadas en una base de datos documental.

| Elemento | Tecnología | Versión |
| --- | --- | --- |
| Entorno de ejecución | Node.js | 24.x |
| Framework HTTP | Express | 4.21 |
| Base de datos | MongoDB | 4.2 o superior |
| ODM | Mongoose | 8.9 |
| Cliente de pruebas | Postman | Última estable |

---

## 2. Estructura del proyecto

```text
rest_api/
├── app.js              Configuración del servidor y conexión a MongoDB
├── package.json        Dependencias y scripts de ejecución
├── .env                Variables de entorno locales (no se versiona)
├── .env.example        Plantilla de variables de entorno
├── .gitignore          Archivos excluidos del repositorio
├── models/
│   └── post.js         Modelo Post: estructura y validaciones
└── routes/
    └── post.js         Rutas y operaciones CRUD del recurso
```

### Responsabilidad de cada archivo

| Archivo | Responsabilidad |
| --- | --- |
| `app.js` | Crea la aplicación Express, registra el middleware JSON, monta las rutas en `/servicios` y abre la conexión con MongoDB antes de escuchar en el puerto. |
| `models/post.js` | Define el esquema del documento: `tittle`, `description` y `date`. Aplica las validaciones de obligatoriedad. |
| `routes/post.js` | Implementa los seis servicios HTTP del recurso y traduce cada resultado a un código de estado HTTP. |
| `.env` | Guarda el puerto y la cadena de conexión. Evita publicar credenciales en el repositorio. |

---

## 3. Requisitos e instalación

### 3.1 Requisitos previos

- Node.js y npm instalados (`node -v`, `npm -v`).
- MongoDB disponible: instancia local o clúster en MongoDB Atlas.
- Postman instalado para el testing.

### 3.2 Instalación

```bash
# 1. Ubicarse en la carpeta del proyecto
cd rest_api

# 2. Instalar las dependencias declaradas en package.json
npm install

# 3. Crear el archivo de variables de entorno
copy .env.example .env     # Windows
cp .env.example .env       # Linux o macOS

# 4. Editar .env con la cadena de conexión propia
```

### 3.3 Variables de entorno

| Variable | Descripción | Ejemplo |
| --- | --- | --- |
| `PORT` | Puerto en el que escucha la API | `10000` |
| `MONGODB_URI` | Cadena de conexión a la base de datos | `mongodb://127.0.0.1:27017/rest_api` |

Ejemplo con MongoDB Atlas:

```env
PORT=10000
MONGODB_URI=mongodb+srv://usuario:clave@cluster0.xxxxx.mongodb.net/rest_api?retryWrites=true&w=majority
```

### 3.4 Ejecución

```bash
npm start        # Ejecución normal
npm run dev      # Ejecución con recarga automática (nodemon)
```

Salida esperada en la consola:

```text
MongoDB conectado
Servidor escuchando en el puerto 10000
```

---

## 4. Modelo de datos

Colección: `posts`

| Campo | Tipo | Obligatorio | Descripción |
| --- | --- | --- | --- |
| `_id` | ObjectId | Generado | Identificador único asignado por MongoDB |
| `tittle` | String | Sí | Título de la publicación |
| `description` | String | Sí | Contenido o descripción de la publicación |
| `date` | Date | Generado | Fecha de creación; se asigna automáticamente |
| `__v` | Number | Generado | Versión interna del documento en Mongoose |

Ejemplo de documento almacenado:

```json
{
  "_id": "6b07b6b4ea7b2eb85069a018",
  "tittle": "Primer post de prueba",
  "description": "Registro creado desde el testing de la API",
  "date": "2026-11-26T04:33:56.440Z",
  "__v": 0
}
```

---

## 5. Documentación de los servicios (endpoints)

**URL base:** `http://localhost:10000`

El recurso se monta bajo el prefijo `/servicios`. Todas las solicitudes y respuestas usan
el formato **JSON** y el encabezado `Content-Type: application/json`.

| # | Método | Endpoint | Operación | Código de éxito |
| --- | --- | --- | --- | --- |
| 1 | `GET` | `/` | Verificar que la API está activa | 200 |
| 2 | `POST` | `/servicios` | Registrar una publicación | 201 |
| 3 | `GET` | `/servicios` | Listar todas las publicaciones | 200 |
| 4 | `GET` | `/servicios/:postId` | Consultar una publicación por identificador | 200 |
| 5 | `PUT` | `/servicios/:postId` | Actualizar una publicación completa | 200 |
| 6 | `PATCH` | `/servicios/:postId` | Actualizar parcialmente una publicación | 200 |
| 7 | `DELETE` | `/servicios/:postId` | Eliminar una publicación | 200 |

---

### 5.1 Servicio 1 — Verificar estado de la API

```http
GET http://localhost:10000/
```

**Respuesta 200**

```text
API funcionando correctamente
```

---

### 5.2 Servicio 2 — Registrar una publicación

```http
POST http://localhost:10000/servicios
Content-Type: application/json
```

**Cuerpo de la solicitud**

```json
{
  "tittle": "Mi primer post",
  "description": "Probando la API"
}
```

**Respuesta 201 Created**

```json
{
  "tittle": "Mi primer post",
  "description": "Probando la API",
  "_id": "6b07b6b4ea7b2eb85069a018",
  "date": "2026-11-26T04:33:56.440Z",
  "__v": 0
}
```

**Respuesta 400 Bad Request** — cuando falta un campo obligatorio:

```json
{
  "message": "Post validation failed: tittle: El titulo es obligatorio"
}
```

---

### 5.3 Servicio 3 — Listar publicaciones

```http
GET http://localhost:10000/servicios
```

**Respuesta 200**

```json
[
  {
    "_id": "6b07b6c0ea7b2eb85069a01a",
    "tittle": "Segundo post de prueba",
    "description": "Otro registro para verificar el listado",
    "date": "2026-11-26T04:34:08.080Z",
    "__v": 0
  },
  {
    "_id": "6b07b6b4ea7b2eb85069a018",
    "tittle": "Primer post de prueba",
    "description": "Registro creado desde el testing de la API",
    "date": "2026-11-26T04:33:56.440Z",
    "__v": 0
  }
]
```

Los resultados se ordenan del más reciente al más antiguo.

---

### 5.4 Servicio 4 — Consultar una publicación por identificador

```http
GET http://localhost:10000/servicios/6b07b6b4ea7b2eb85069a018
```

**Respuesta 200**

```json
{
  "_id": "6b07b6b4ea7b2eb85069a018",
  "tittle": "Primer post de prueba",
  "description": "Registro creado desde el testing de la API",
  "date": "2026-11-26T04:33:56.440Z",
  "__v": 0
}
```

**Respuesta 404 Not Found**

```json
{
  "message": "Post no encontrado"
}
```

**Respuesta 400 Bad Request** — identificador con formato inválido:

```json
{
  "message": "Identificador no valido"
}
```

---

### 5.5 Servicio 5 — Actualizar una publicación completa

```http
PUT http://localhost:10000/servicios/6b07b6b4ea7b2eb85069a018
Content-Type: application/json
```

**Cuerpo de la solicitud**

```json
{
  "tittle": "Título definitivo",
  "description": "Descripción definitiva del post"
}
```

**Respuesta 200** — devuelve el documento ya actualizado.

---

### 5.6 Servicio 6 — Actualizar parcialmente una publicación

```http
PATCH http://localhost:10000/servicios/6b07b6b4ea7b2eb85069a018
Content-Type: application/json
```

**Cuerpo de la solicitud**

```json
{
  "tittle": "Titulo actualizado desde PATCH"
}
```

**Respuesta 200**

```json
{
  "_id": "6b07b6b4ea7b2eb85069a018",
  "tittle": "Titulo actualizado desde PATCH",
  "description": "Registro creado desde el testing de la API",
  "date": "2026-11-26T04:33:56.440Z",
  "__v": 0
}
```

Solo se modifican los campos enviados; los demás conservan su valor anterior.

---

### 5.7 Servicio 7 — Eliminar una publicación

```http
DELETE http://localhost:10000/servicios/6b07b6b4ea7b2eb85069a018
```

**Respuesta 200**

```json
{
  "message": "Post eliminado correctamente",
  "post": {
    "_id": "6b07b6b4ea7b2eb85069a018",
    "tittle": "Titulo actualizado desde PATCH",
    "description": "Registro creado desde el testing de la API",
    "date": "2026-11-26T04:33:56.440Z",
    "__v": 0
  }
}
```

**Respuesta 404 Not Found** — si el identificador ya no existe:

```json
{
  "message": "Post no encontrado"
}
```

---

## 6. Resumen de códigos de estado utilizados

| Código | Significado | Cuándo se devuelve |
| --- | --- | --- |
| `200` | OK | Consulta o actualización exitosa |
| `201` | Created | Publicación registrada correctamente |
| `400` | Bad Request | Datos inválidos, campos faltantes o identificador mal formado |
| `404` | Not Found | El identificador no corresponde a ningún documento |
| `500` | Internal Server Error | Falla inesperada del servidor o de la base de datos |

---

## 7. Testing con Postman

La colección `postman/AA5_EV03_API_Post.postman_collection.json` contiene las siete
solicitudes listas para ejecutar.

### 7.1 Importar la colección

1. Abrir Postman.
2. Seleccionar **Import**.
3. Arrastrar el archivo `.postman_collection.json` o buscarlo con **Upload Files**.
4. Confirmar la importación.

### 7.2 Orden de ejecución sugerido

| Paso | Solicitud | Verificación |
| --- | --- | --- |
| 1 | Estado de la API | La respuesta es el texto `API funcionando correctamente` |
| 2 | Registrar publicación | Código `201` y documento con `_id` y `date` |
| 3 | Listar publicaciones | Arreglo JSON con los documentos registrados |
| 4 | Consultar por ID | Documento cuyo `_id` coincide con el solicitado |
| 5 | Actualizar (PATCH) | El campo `tittle` cambia y los demás se conservan |
| 6 | Eliminar | Mensaje de confirmación |
| 7 | Consultar por ID (repetir) | Código `404`, confirma que el documento ya no existe |

> La colección define la variable `{{baseUrl}}` con el valor `http://localhost:10000` y la
> variable `{{postId}}`, que debe reemplazarse con el `_id` devuelto por el servicio de registro.

---

## 8. Verificación del almacenamiento en MongoDB

Los registros creados pueden comprobarse en la base de datos con cualquiera de estas opciones:

**Desde MongoDB Compass**

1. Conectar con la cadena `mongodb://127.0.0.1:27017` o con la cadena de Atlas.
2. Seleccionar la base `rest_api` y la colección `posts`.
3. Verificar los documentos creados desde Postman.

**Desde la consola de MongoDB**

```javascript
use rest_api
db.posts.find().pretty()
```

**Desde mongosh en un clúster de Atlas**

```javascript
use rest_api
db.posts.find()
```

---

## 9. Decisiones técnicas y buenas prácticas aplicadas

| Práctica | Aplicación en el proyecto |
| --- | --- |
| Credenciales fuera del repositorio | La cadena de conexión vive en `.env`, excluido por `.gitignore`. |
| Validación de datos entrantes | El esquema exige `tittle` y `description`; los errores se devuelven como `400`. |
| Códigos HTTP adecuados | `201` al crear, `404` cuando el recurso no existe, `400` ante datos inválidos. |
| Separación de responsabilidades | Configuración, modelo y rutas en archivos distintos. |
| Existencia comprobada antes de responder | Ninguna actualización o borrado responde éxito sin documento afectado. |
| Manejo de errores controlado | Cada operación captura la excepción y responde con un mensaje claro. |
| Control de versiones | El proyecto se administra con Git y se publica en GitHub. |

---

## 10. Repositorio

El código fuente y el historial de versiones se encuentran en el repositorio enlazado en el
archivo `ENLACE_REPOSITORIO.txt` que acompaña a la entrega.

---

## 11. Autoría

Daniela Narváez Jiménez — Análisis y Desarrollo de Software — SENA Regional Caldas.
