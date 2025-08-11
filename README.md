🚀 Fullstack App - Finanzauto

Aplicación Fullstack desarrollada como parte de la prueba técnica para **Finanzauto**.  
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
- Docker
- Docker Compose
- Git

---

📂 Estructura del Proyecto

fullstack-app/
│── users/               # Microservicio de usuarios
│── posts/               # Microservicio de publicaciones
│── frontend/            # Frontend React
│── docker-compose.yml   # Orquestación de servicios
│── README.md

---

⚙️ Levantar el Proyecto

1️⃣ Clonar el repositorio:
git clone <URL_REPOSITORIO>
cd fullstack-app

2️⃣ Construir e iniciar todos los servicios:
docker-compose up --build

Esto levantará:
- **Users Service** → http://localhost:8000
- **Posts Service** → http://localhost:8001
- **Frontend** → http://localhost:5173 (o el puerto que use Vite)
- **PostgreSQL** → puerto 5432

---

🛠 Crear Tablas (Migraciones con Alembic)

Cuando levantas por primera vez, debes correr las migraciones en **cada microservicio**.

🔹 Users Service
docker exec -it users_service bash
alembic upgrade head
exit

🔹 Posts Service
docker exec -it posts_service bash
alembic upgrade head
exit

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

📝 Notas Finales
- Si cambias el modelo de datos, recuerda:
# Dentro del microservicio correspondiente
alembic revision --autogenerate -m "descripcion del cambio"
alembic upgrade head

- Si quieres entrar a PostgreSQL manualmente:
docker exec -it postgres_db psql -U postgres -d postgres

---

👨‍💻 Desarrollado por: MAICOLL CALDERON PARDO
📅 Fecha: 2025
