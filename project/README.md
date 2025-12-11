Web System Development – Final Project

Task Manager App (Frontend + Backend + Database)
Proyecto desarrollado para la asignatura Web System Development (Universidad Loyola).

Descripción del Proyecto

Este proyecto consiste en una aplicación full-stack de gestión de tareas, donde el usuario puede:

Crear tareas, editarlas, eliminarlas, listarlas, filtrar por tipo y prioridad.

El frontend está construido con React + Vite, mientras que el backend utiliza Node.js + Express.
Los datos se almacenan en una base de datos PostgreSQL organizada en dos tablas relacionadas: task_types y tasks

Tech Stack
Frontend: React 19, Vite, Axios, CSS, React Router, Componentes modulares y vistas dinámicas

Backend: Node.js, Express, pg (PostgreSQL driver) y dotenv

Database: PostgreSQL, relaciones con claves externas y script SQL de inicialización

Estructura del Proyecto:
project/
├── backend/
│   ├── app.js
│   ├── db.js
│   ├── routes/
│   │   ├── tasks.js
│   │   └── taskTypes.js
│   ├── controllers/
│   │   ├── tasksController.js
│   │   └── taskTypesController.js
│   ├── models/
│   │   ├── taskModel.js
│   │   └── taskTypeModel.js
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   │   └── Dashboard.jsx
    │   ├── services/
    │   │   └── api.js
    │   └── App.jsx
    ├── vite.config.js
    └── package.json

Instalación y Ejecución
Prerrequisitos: Node.js, npm, Docker, PostgreSQL local o DB en Render

Backend
1. Instalar dependencias
cd backend
npm install

2. Configurar variables de entorno

Crear un archivo .env basado en .env.example:

DB_HOST=localhost
DB_NAME=projectdb
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_PORT=5432
PORT=3001

4. Ejecutar backend
npm start

El servidor arrancará en: http://localhost:3001/api

Frontend
1. Instalar dependencias
cd frontend
npm install

2. Crear variables de entorno

Archivo: .env

VITE_API_URL="http://localhost:3001/api"

3. Ejecutar frontend:
npm run dev

Vite levantará la app en: http://localhost:5173

API Documentation
Base URL: http://localhost:3001/api

Task Types Endpoints
GET /task-types

Obtiene todos los tipos de tarea.

POST /task-types

Body JSON:

{ "name": "Work" }

Tasks Endpoints
GET /tasks

Lista todas las tareas.

POST /tasks
{
  "title": "Study React",
  "description": "Hooks, JSX, routing",
  "priority": 2,
  "task_type_id": 1
}

PUT /tasks/:id

Actualiza una tarea.

DELETE /tasks/:id

Elimina una tarea.

Deployment
Frontend

Autores
Proyecto realizado por:
Carlos Benjumea Neira y Vincenzo Cimadomo Martinez
Universidad Loyola Andalucía · 2024/2025