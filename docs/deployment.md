# Despliegue del portfolio

Frontend React/Vite en Vercel, API NestJS en Render y PostgreSQL en Neon. Esta guía permite configurar los proveedores manualmente; el propietario también autorizó la publicación asistida desde el repositorio. Usa una base nueva dedicada a esta demo; no se importa ni se modifica la base anterior.

## Entorno del portfolio

| Recurso | Dirección |
| --- | --- |
| Frontend | https://project-management-murex-pi.vercel.app |
| API | https://project-management-api-5xe1.onrender.com |
| Salud de la API | https://project-management-api-5xe1.onrender.com/health |
| Salud a través de Vercel | https://project-management-murex-pi.vercel.app/api/health |

Vercel usa el plan Hobby, Node 22 y Root Directory `frontend`. Render usa el plan Free, Node 22, la región Ohio (cerca de la base Neon en `us-east-2`) y Root Directory `backend`. Ambos están vinculados a `main` del repositorio GitHub. Los secretos existen únicamente en los entornos privados del proveedor y en archivos locales ignorados.

## Archivos preparados

- `render.yaml`: referencia de configuración del servicio Node gratuito; también puedes crear el servicio manualmente con los mismos valores.
- `frontend/vercel.json`: proxy de `/api` hacia Render y rutas de la SPA.
- `backend/.env.example` y `frontend/.env.example`: variables locales de ejemplo.
- `.node-version` y `engines`: Node 22 para ambos proyectos.

## 1. Neon

Crea un proyecto/base nuevos y copia la cadena de conexión **directa**, sin `-pooler`, desde Connect (desactiva Connection pooling). Guárdala únicamente en `DATABASE_URL`: la aplicación, las migraciones y el seed usan esa misma variable. Conserva `sslmode=require`; puedes añadir `connect_timeout=15` y `connection_limit=3` para limitar las conexiones de este backend Node persistente.

Este proyecto conserva Prisma 6 y declara únicamente `url = env("DATABASE_URL")` en `backend/prisma/schema.prisma`. La conexión directa permite ejecutar las migraciones con la misma URL, sin una segunda variable. No requiere Neon Auth, Supabase ni actualizar Prisma a otra versión mayor. Referencias: [conexiones directas y con pool de Neon](https://neon.com/docs/connect/connection-pooling#when-to-use-pooled-vs-direct-connections), [documentación de Prisma 6](https://docs.prisma.io/docs/orm/v6/overview/databases/neon).

## 2. Render

Crea un **Web Service**, runtime **Node**, plan **Free**, conectado al repositorio:

| Campo | Valor |
| --- | --- |
| Root Directory | `backend` |
| Build Command | `npm ci --include=dev && npm run prisma:generate && npm run build` |
| Start Command | `npm run db:deploy && npm run start:prod` |
| Health Check Path | `/health` |
| Node | `22` |

Configura estas variables en Render:

| Variable | Valor |
| --- | --- |
| `NODE_ENV` | `production` |
| `NODE_VERSION` | `22` |
| `DATABASE_URL` | Conexión directa de la nueva base Neon, con TLS |
| `JWT_SECRET` | Valor aleatorio de al menos 32 caracteres, exclusivo de esta demo |
| `CLIENT_URL` | Origen exacto del frontend, por ejemplo `https://mi-portfolio.vercel.app`, sin `/` final |

Puedes generar el secreto localmente con `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`. Guárdalo únicamente en las variables del proveedor o en un `.env` ignorado por Git. Nunca lo publiques como variable `VITE_*`.

Si aún no conoces la URL del frontend, crea primero el proyecto Vercel y después completa `CLIENT_URL`. Render proporciona `PORT`; el servidor escucha en `0.0.0.0`.

Las migraciones pendientes se aplican antes de arrancar el servidor. Si fallan, el servidor no arranca. El seed **no** forma parte del build ni del arranque. `--include=dev` mantiene disponibles Prisma CLI y las herramientas de build; `@prisma/client` es dependencia de ejecución. Consulta [servicios web de Render](https://render.com/docs/web-services).

## 3. Inicializar los Datos demo una sola vez

Desde tu equipo, entra en `backend`, instala las dependencias con `npm ci` y prepara un `.env` con las conexiones de la **nueva base dedicada a la demo**, partiendo de `.env.example`. Usa los valores reales únicamente en ese archivo local ignorado. Si una variable de entorno de tu terminal ya existe, tiene prioridad sobre `.env`: verifica el destino antes de ejecutar comandos.

Ejecuta, dentro de `backend`:

```sh
npm run prisma:generate
npm run db:deploy
npm run demo:seed
```

El seed crea dos proyectos, seis identidades ficticias, cuatro épicas, ocho features, 36 tickets, 72 tareas y seis sprints, con estados, backlog, asignaciones, etiquetas, bloqueos, pair programming, objetivos, capacidades y retrospectivas. Los periodos y vencimientos se calculan respecto al momento de inicialización.

Repetir `demo:seed` devuelve `status: unchanged` y conserva las ediciones y los proyectos creados por visitantes. Una transacción evita una inicialización parcial y un bloqueo de base serializa ejecuciones simultáneas. La transacción admite hasta dos minutos para soportar los viajes de red al cargar el escenario completo en Neon. Si la base contiene usuarios/proyectos ajenos a esta demo, la inicialización se rechaza.

## 4. Vercel

Crea el proyecto con Root Directory **`frontend`**, framework **Vite**, Install Command **`npm ci`**, Build Command **`npm run build`**, Output Directory **`dist`** y Node **22.x**.

`frontend/vercel.json` apunta actualmente a `https://project-management-api-5xe1.onrender.com`, la URL real del servicio del portfolio. Si creas otro servicio, actualiza ese destino con la URL HTTPS que Render le asigne: el nombre del servicio no garantiza un subdominio exacto. Configura:

| Variable | Valor |
| --- | --- |
| `VITE_API_URL` | `/api` |
| `VITE_SOCKET_URL` | URL HTTPS real de Render, sin `/api` y sin `/` final |

Mantén `VITE_API_URL=/api`: el proxy permite que las cookies de sesión sean del mismo origen del frontend. El backend usa cookies HttpOnly, SameSite=Lax y Secure en producción. Los WebSockets conectan directamente a Render, con el origen autorizado por `CLIENT_URL`; no atraviesan el proxy HTTP.

Conserva `trailingSlash: false` en `frontend/vercel.json`: normaliza las rutas antes del proxy y evita que peticiones existentes como `/api/projects/` o `/api/users/` terminen en el fallback HTML de la SPA. Después de cambiar el enrutamiento, ejecuta desde la raíz `node frontend/scripts/check-deployment.mjs` (admite otra URL de frontend como argumento). La comprobación valida JSON con y sin barra final, POST de acceso demo, cookies de sesión, proyectos/usuarios poblados, errores API y una ruta interna de la SPA.

Las variables `VITE_*` son públicas y quedan incorporadas al build. Cambiarlas requiere otro despliegue. No pongas cadenas de conexión ni secretos allí. Mantén el proxy `/api` antes del fallback a `index.html`; así recargar `/projects/.../board` funciona. Referencias: [rewrites de Vercel](https://vercel.com/docs/routing/rewrites), [Vite SPA en Vercel](https://vercel.com/docs/frameworks/frontend/vite), [WebSockets en Render](https://render.com/docs/websocket).

Configura `CLIENT_URL` con la URL estable de producción. Las URLs de preview de Vercel no se autorizan automáticamente: usa la URL de producción para las comprobaciones del socket.

## 5. Comprobar el despliegue

1. Abrir `https://TU-API.onrender.com/health`: devuelve `{"status":"ok"}` cuando PostgreSQL responde.
2. Abrir `https://TU-FRONTEND.vercel.app/api/health`: debe devolver lo mismo a través del proxy.
3. Entrar con **Explore demo**, sin correo ni contraseña: deben aparecer los dos proyectos.
4. Revisar overview, board, backlog, sprints, épicas/features, equipo, objetivos, capacidades y retrospectivas.
5. Recargar una ruta interna y comprobar que conserva la sesión. Repetir con bloqueo de cookies de terceros activado.
6. Abrir dos ventanas, editar un ticket y comprobar su actualización en la otra. Cada visitante tiene su propia cookie aunque comparta la identidad demo.
7. Cerrar la sesión en una ventana: la otra debe seguir funcionando. Registro, login personal y selección de correo no están disponibles.

El servicio gratuito de Render puede suspenderse tras 15 minutos sin tráfico y tardar aproximadamente un minuto en reactivarse. Neon también puede reactivar su cómputo al volver a usarse. La pantalla de entrada informa de la posible espera. No se incluye ningún cron de keepalive. [Límites gratuitos de Render](https://render.com/docs/free).

## Restaurar manualmente la demo

Los visitantes comparten un espacio editable. Restaurar elimina **todos los proyectos y cambios de la base dedicada a esta demo**, incluidos los creados por visitantes, y vuelve a crear el escenario inicial con fechas actuales. No uses este comando en una base de uso personal o compartida con otra aplicación.

Desde `backend`, con el `.env` apuntando a la base demo correcta:

```sh
npm run demo:reset -- --confirm-demo-reset
```

En PowerShell, usa `npm.cmd run demo:reset -- --confirm-demo-reset` para conservar el separador de argumentos al invocar npm.

Sin `--confirm-demo-reset` el comando se rechaza. También se rechaza si no existe la identidad que marca la demo inicializada. No se programa ninguna restauración automática y no existe un endpoint público para ejecutarla. Los IDs de tickets pueden cambiar tras restaurar: los visitantes deben recargar las vistas abiertas. Las fechas envejecen con el uso; restaura antes de una presentación si quieres mostrar próximos vencimientos.

## Desarrollo y pruebas

La guía reproducible de arranque local, comandos de calidad y pruebas PostgreSQL aisladas está en [development.md](development.md). Usa el runner protegido `npm test` del backend para las pruebas con fixtures.

Para trabajar localmente, copia los ejemplos a `.env` de cada aplicación, usa una base local independiente, ejecuta los comandos de inicialización anteriores y luego `npm run start:dev` en `backend` y `npm run dev` en `frontend`. El proxy local `/api` usa `API_PROXY_TARGET`; el socket usa `VITE_SOCKET_URL`.

El frontend también admite `npm start`. Si ya tenías archivos `.env` del despliegue anterior, configura la conexión elegida en `DATABASE_URL`; no se necesita una segunda variable de conexión. `JWT_SECRET` debe ser aleatorio y tener al menos 32 caracteres. La URL directa de Neon se copia del proveedor cuando prepares producción.

En desarrollo, `DEV_PORT` fija el puerto del frontend (por defecto 5173). Si otro proyecto lo ocupa, elige uno libre y usa el mismo origen en `CLIENT_URL` del backend; por ejemplo, `DEV_PORT=5180` con `CLIENT_URL=http://localhost:5180`. Vite falla explícitamente si el puerto elegido está ocupado, en lugar de cambiar silenciosamente el origen. Mantén `VITE_API_URL=/api`, `VITE_SOCKET_URL=http://localhost:3000` y `API_PROXY_TARGET=http://localhost:3000` si la API local usa el puerto 3000.

Si la base local ya contiene datos anteriores, puedes conservarlos y preparar la demo en otro esquema de **esa misma base**. La preparación local anterior usó `schema=portfolio_demo` en `DATABASE_URL`; los datos anteriores permanecen en `public` de esa base local. Migra e inicializa siempre usando la URL del esquema demo elegido. Cambiar de esquema no copia ni borra los datos anteriores, y la restauración manual opera sobre el esquema señalado por `DATABASE_URL`.

La prueba de integración necesita una base PostgreSQL **local vacía y exclusiva de pruebas**, con un nombre terminado en `_test`. Define `TEST_DATABASE_URL` con esa conexión. Aplica las migraciones a esa misma base usando `DATABASE_URL` antes de ejecutar:

```sh
npm test -- demo.e2e-spec.ts
```

Ejecuta el comando dentro de `backend`. La prueba rechaza hosts remotos y nombres sin sufijo `_test`; limpia las tablas de esa base, ejecuta el seed/restauración y verifica el contenido mediante HTTP. No apuntes variables de pruebas a Neon ni a la base anterior. No hace falta configurar los proveedores para esta verificación local.

## Después del despliegue

El README en inglés presenta el producto, la arquitectura y el arranque local. El video y su página pública usan los archivos estáticos del frontend en `/walkthrough`, con capítulos, transcripción y descargas independientes del backend. La [guía del walkthrough](walkthrough.md) y el [registro de verificación](verification.md) documentan las fuentes y la publicación.
