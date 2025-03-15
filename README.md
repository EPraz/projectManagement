# projectManagement

para backend:
-> acceder a la carpeta con cd ./backend/
-> npm run start:dev
-> ruta http://localhost:3000/ {verificar controller}

para frontend:
-> acceder a la carpeta con cd ./frontend/
-> npm run dev
-> ruta http://localhost:5173/ {verificar routes}

Rutas Principales
/login → Página de inicio de sesión.
/projects → Lista de proyectos (si hay más de uno).
/projects/:id → Dashboard del proyecto seleccionado.
/projects/:id/board → Contiene los tabs: Taskboard, Backlog, Goals, Planning, Configuración.
/projects/:id/retrospective → Página de Retrospective.
/projects/:id/epics → Página para gestionar Epics y Features.
