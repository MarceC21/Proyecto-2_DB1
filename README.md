# Proyecto BSD - Tienda (Inventario y Ventas)

Aplicación web para la gestión de inventario y ventas de una tienda pequeña. Incluye frontend, backend y base de datos relacional, todo desplegado con Docker.

---

## Descripción

Este sistema permite:

* Gestionar productos, clientes, compras y ventas
* Controlar el stock de productos
* Registrar ventas con múltiples productos
* Consultar reportes desde la interfaz
* Ejecutar consultas SQL avanzadas desde el backend

---

## Tecnologías utilizadas

* **Frontend:** React
* **Backend:** Flask (Python)
* **Base de datos:** PostgreSQL
* **Contenedores:** Docker + Docker Compose

---

## Estructura del proyecto

```
backend/
│── app/
│   ├── __init__.py
│   ├── __main__.py
│   ├── db.py          # Conexión a PostgreSQL
│   ├── routes.py      # Endpoints de la API
│
│── Dockerfile
│── requirements.txt

db/
│── init.sql           # Creación de tablas, inserts, views, etc.

frontend/
│── public/
│   └── index.html
│
│── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   └── Tablita.jsx
│   │
│   ├── pages/
│   │   ├── Clientes.jsx
│   │   ├── Compras.jsx
│   │   ├── Productos.jsx
│   │   └── Ventas.jsx
│   │
│   ├── services/
│   │   └── api.js     # Conexión al backend
│   │
│   ├── App.js
│   └── index.js
│
│── Dockerfile
│── package.json

.env.example
docker-compose.yml
README.md
```

---

## Navegación de la aplicación (Páginas)

Esta sección describe qué se puede hacer en cada página

### Productos (`/productos`)

* CRUD completo de productos:
  * Crear producto
  * Editar producto
  * Eliminar producto
  * Listar productos
* Validación de IDs inexistentes (manejo de errores)
* Visualización en tabla
* Base para control de inventario
---

### Ventas (`/ventas`)

* Registro de ventas con múltiples productos
* Visualización de ventas realizadas
* Asociación entre productos, clientes y empleados
* Actualización automática de stock


---

### Clientes (`/clientes`)

* Visualización de clientes registrados
* Relación con ventas

---

### Compras (`/compras`)

* Registro de compras a proveedores
* Relación con proveedores

---

## Reportes y Consultas SQL

La aplicación incluye consultas avanzadas ejecutadas desde el backend y visibles en la interfaz:

* Consultas con **JOIN** entre múltiples tablas
* Consultas con **GROUP BY y funciones de agregación**
* Consultas con **subqueries**
* Uso de **VIEW** definida en la base de datos
* Consultas para:

  * Productos más vendidos
  * Productos con bajo stock
  * Ventas por producto


---

## ⚙️ Requisitos

* Docker
* Docker Compose

---

## Cómo ejecutar el proyecto

### 1. Clonar el repositorio

```bash
git clone <git@github.com:MarceC21/Proyecto-2_DB1.git>
cd <Proyecto-2_DB1>
```

---

### Configurar variables de entorno

Crear un archivo `.env` basado en `.env.example`con las credenciales correspondientes

---

### 3. Levantar los servicios

```bash
docker-compose up --build
```

Esto levantará:

* PostgreSQL (base de datos)
* Backend Flask
* Frontend React

---

### 4. Acceder a la aplicación

* Frontend:
  [http://localhost:3000](http://localhost:3000)

* Backend API:
  [http://localhost:5000](http://localhost:5000)

---

## Inicialización de la base de datos

El archivo:

```
db/init.sql
```

Se ejecuta automáticamente al iniciar PostgreSQL e incluye:

* Creación de tablas
* Relaciones (FOREIGN KEY)
* Inserts de prueba (mínimo 25 registros por tabla)
* Views utilizadas por el backend
* Índices para optimización

---

## Endpoints principales (Backend)

Ejemplos:

* `GET /productos`

* `POST /productos`

* `PUT /productos/<id>`

* `DELETE /productos/<id>`

* `GET /ventas`

* `POST /ventas`

Incluye manejo de errores para IDs inválidos.

---

## Funcionalidades principales

✔ CRUD completo de productos
✔ CRUD de ventas
✔ Visualización de datos en tablas
✔ Manejo de errores en frontend y backend
✔ Consultas SQL complejas (JOIN, GROUP BY, etc.)
✔ Reportes visibles en la UI

---

## 🐳 Docker

Ejecutar:

```bash
docker-compose up --build
```

Detener:

```bash
docker-compose down
```

---

## ⚠️ Notas importantes

* Si modificas `init.sql`, reinicia la base de datos:

```bash
docker-compose down -v
docker-compose up --build
```

* Verifica que los puertos estén disponibles

---
