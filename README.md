🚀 Fullstack App - Test

Aplicación Fullstack desarrollada como parte de una prueba técnica.  
Permite a los usuarios **registrarse, autenticarse, actualizar su perfil y gestionar publicaciones**.  

El proyecto está dividido en dos microservicios:
- **Users Service** → Gestión de usuarios (registro, login, perfil).
- **Posts Service** → Gestión de publicaciones.
- **Frontend (React)** → Interfaz gráfica.
- **Base de datos** → PostgreSQL.

Todo está contenerizado con **Docker Compose**.

---

📌 Requerimientos Previos
Asegúrate de tener instalado:
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Git](https://git-scm.com/)

---

## 📂 Estructura del proyecto
```txt
fullstack-app/
├─ backend/
│  ├─ users/                 # Microservicio de usuarios
│  ├─ posts/                 # Microservicio de publicaciones
├─ frontend/                 # Frontend React (Vite)
├─ docker-compose.yml        # Orquestación de servicios
└─ README.md
```

---

⚙️ Levantar el Proyecto

1️⃣ Clonar el repositorio:
git clone <URL_REPOSITORIO>
cd fullstack-app

2️⃣ Construir e iniciar todos los servicios:
docker-compose up --build

Esto iniciará:
- **Users API** → [http://localhost:8000](http://localhost:8000)  
- **Posts API** → [http://localhost:8001](http://localhost:8001)  
- **Frontend** → [http://localhost:5173](http://localhost:5173) (o el puerto que use Vite)  
- **PostgreSQL** → puerto `5432`

---

🛠 Crear Tablas (Migraciones con Alembic)

Cuando levantas por primera vez, debes correr las migraciones en **cada microservicio**.

🔹 Users Service
```bash
docker exec -it users_service bash -lc "alembic upgrade head"
exit
```

🔹 Posts Service
```bash
docker exec -it posts_service bash -lc "alembic upgrade head"
exit
```

> Si te aparece “alembic: command not found”, prueba:
> ```bash
> docker exec -it users_service bash -lc "python -m alembic upgrade head"
> docker exec -it posts_service bash -lc "python -m alembic upgrade head"
> ``
---

## 💻 Frontend (manual, fuera de Docker)
Si prefieres ejecutar el frontend localmente:
```bash
cd frontend
npm install
npm run dev
```
Abrir en: **http://localhost:5173**

---
🔄 Regenerar la Base de Datos (si se borran volúmenes)

Si ejecutas:
docker-compose down -v

❗ Esto eliminará todas las tablas y datos. Para restaurarlas:

1️⃣ Levantar servicios de nuevo:
docker-compose up --build

2️⃣ Correr migraciones en **users_service**:
docker exec -it users_service bash
alembic upgrade head
exit

3️⃣ Correr migraciones en **posts_service**:
docker exec -it posts_service bash
alembic upgrade head
exit

---

🔐 Usuarios y Autenticación
- **Registro** → /auth/register
- **Login** → /auth/login → retorna un JWT que se guarda en localStorage para futuras peticiones.
- **Perfil** → /profile (GET y PUT para ver y actualizar).
- **Validaciones**: Contraseña segura, correo único, campos obligatorios.

---

📰 Publicaciones
- **Crear publicación** → /posts (POST)
- **Listar publicaciones** → /posts (GET)
- **Eliminar publicación** → /posts/{id} (DELETE)
- Solo usuarios autenticados pueden interactuar con este microservicio.

---

🖥 Frontend
El frontend fue desarrollado en **React + Bootstrap**, y permite:
- Registro y login.
- Edición de perfil.
- Crear, listar y eliminar publicaciones.
- Validación de formularios y manejo de errores desde el backend.

Ejecutar frontend manualmente (opcional, fuera de Docker):
cd frontend
npm install
npm run dev

---

🧩 Comunicación entre Microservicios
- **Posts Service** valida la autenticación del usuario consultando el **Users Service** mediante JWT.
- Ambos microservicios usan la misma base de datos PostgreSQL (en este caso un contenedor `postgres_db`).

---
## 🛠 Comandos útiles

```bash
# Ver puertos expuestos
docker compose ps

# Inspeccionar logs
docker compose logs -f users_service
docker compose logs -f posts_service
docker compose logs -f db

# Detener y eliminar contenedores
docker compose down

# Limpiar caché de imágenes y volúmenes
docker system prune -af
docker volume prune -f
```

---
## 🧪 Migraciones nuevas (cuando cambias el modelo)
Dentro del microservicio correspondiente:
```bash
alembic revision --autogenerate -m "descripcion del cambio"
alembic upgrade head
```
---

## 🐘 Acceso manual a PostgreSQL
```bash
docker exec -it postgres_db psql -U postgres -d postgres
```
*(Cambia `postgres_db` por el nombre real del contenedor si difiere: `docker compose ps`)*

---
📝 Notas Finales
- El mensaje `invalid length of startup packet` en Postgres es normal si un cliente intenta conectarse con protocolo equivocado (por ejemplo, un healthcheck HTTP al puerto 5432).  
Si quieres silenciar ese mensaje, usa un healthcheck nativo con `pg_isready` en `docker-compose.yml`.
---

👨‍💻 Desarrollado por: MAICOLL CALDERON PARDO
📅 Fecha: 2025
