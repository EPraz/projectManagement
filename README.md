# Project Management App (NestJS + React)

Aplicación de gestión de proyectos y sprints inspirada en Azure DevOps. Permite crear proyectos, manejar tickets y tareas, gestionar equipos, hacer retrospectivas y más. Desarrollado con NestJS, Prisma, PostgreSQL, React y Vite.

## Tecnologías Utilizadas

- Backend: NestJS + Prisma + PostgreSQL
- Frontend: React + Vite + TypeScript
- Comunicación: REST API + WebSockets
- Hosting: Fly.io

## Instrucciones para correr localmente

### Backend

```bash
cd backend
npm install
npm run start:dev
# Servido en: http://localhost:3000/
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# Servido en: http://localhost:5173/
```

---

### 5. Rutas principales y navegación

## Navegación Principal

```bash

- `/login` → Página de inicio de sesión.
- `/projects` → Lista de proyectos.
- `/projects/:id` → Dashboard del proyecto seleccionado.
- `/projects/:id/board` → Contiene tabs: Taskboard, Backlog, Goals, Planning, Configuración.
- `/projects/:id/retrospective` → Página de revisión de Sprint.
- `/projects/:id/epics` → Gestión de Epics y Features.
```

## Producción

- [Demo en Fly.io](https://projectmanagement.fly.dev)
