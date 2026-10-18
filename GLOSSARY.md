# Project Management

Plataforma de gestión de proyectos, planificación de sprints y seguimiento de tickets, presentada como proyecto de portfolio.

## Language

**Usuario demo**:
Identidad dedicada al acceso rápido de visitantes al portfolio, distinta de las identidades personales registradas. No representa una cuenta elegida por el visitante.
_Avoid_: administrador demo.

**Acceso demo**:
Modalidad de entrada sin registro para explorar y probar interactivamente el producto con el Usuario demo.
_Avoid_: ingreso como otro usuario.

**Ticket**:
Unidad de trabajo del proyecto que puede planificarse en un sprint, vincularse con una funcionalidad y contener tareas. Tiene su propio estado de seguimiento.
_Avoid_: tarea, cuando se habla de la unidad que contiene tareas.

**Tarea**:
Acción de ejecución dentro de un ticket, con su propio estado y posible responsable. Su estado de avance es distinto del estado del ticket.
_Avoid_: ticket, cuando se habla de una acción de ejecución dentro de él.

**Taskboard**:
Vista de ejecución del sprint organizada en filas de tickets y columnas de estados de sus tareas. El estado propio de cada ticket es independiente de las columnas de tareas.
_Avoid_: tablero de tickets por estado, cuando se habla de esta vista.

**Ticket bloqueado**:
Ticket cuya marca de bloqueo está activa o cuyo estado es Blocked. Si ambas condiciones coinciden, sigue siendo un único ticket bloqueado.

**Recent updates**:
Resumen de las creaciones y últimas modificaciones conocidas de los elementos del proyecto. No representa una secuencia completa de todos los cambios que han ocurrido.
_Avoid_: historial de auditoría, para este resumen.

**Datos demo**:
Contenido ficticio preparado para mostrar las funcionalidades del portfolio con proyectos, planificación y seguimiento poblados. Es independiente de los datos del despliegue anterior.
