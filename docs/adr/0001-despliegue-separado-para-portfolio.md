# Despliegue separado para el portfolio

Conservamos el frontend React/Vite y el backend NestJS modular existentes: el frontend se publicará en Vercel, el backend en Render y PostgreSQL en Neon. Sustituimos el empaquetado conjunto de frontend y backend usado con Docker/Fly.io para aprovechar los planes gratuitos, aceptando la espera inicial del backend tras periodos de inactividad y la configuración de sesiones y comunicación entre despliegues.

El propietario realizará manualmente el despliegue y la configuración de los proveedores; el trabajo del repositorio consiste en preparar los archivos, comandos, variables documentadas y verificaciones necesarios. Se usarán inicialmente los dominios gratuitos de los proveedores.

La base nueva se inicializará con el esquema de la aplicación y Datos demo, sin importar datos del despliegue anterior. No se borrarán ni modificarán los recursos anteriores como parte de esta preparación. El portfolio ofrecerá únicamente Acceso demo: una identidad dedicada y un espacio compartido editable, sin registro ni inicio de sesión de cuentas personales. La restauración de los Datos demo será una operación manual explícita; los reinicios y despliegues conservarán los cambios de los visitantes.
