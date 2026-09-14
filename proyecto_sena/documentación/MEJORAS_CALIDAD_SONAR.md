# Mejoras de calidad y seguridad

Fecha: 2026-09-13
Proyecto: `NicolasPinzon732/proyecto_sena_react`

## Punto de partida

El análisis de SonarCloud reportaba 47 incidencias abiertas:

- 9 problemas de seguridad, incluyendo CSRF por rutas construidas con entradas no confiables y API Traversal.
- 38 problemas de confiabilidad, principalmente etiquetas de formularios sin control asociado y expresiones regulares con backtracking potencial.
- 1 problema de mantenibilidad por ordenar sin una función comparadora.
- 1.4% de duplicación.
- Sin cobertura de pruebas configurada.
- Quality Gate: `Not computed`, porque no había condiciones configuradas.

## Cambios realizados

### Seguridad de peticiones

- Se centralizó la construcción de peticiones en `src/utils/api.js`.
- `apiFetch` rechaza rutas absolutas, protocolos externos y rutas que no comienzan con `/`.
- Los identificadores numéricos se validan mediante `validarIdApi` antes de interpolarse.
- Los estados de pedido y roles se validan contra listas permitidas mediante `validarOpcionApi`.
- Los valores de búsqueda se codifican con `encodeURIComponent`.
- Se migraron los listados de usuarios, productos y pedidos, además de los formularios de usuario y producto, al cliente API común.

Esto elimina las concatenaciones inseguras identificadas por Sonar en `UsuariosList`, `ProductosList`, `PedidosList`, `PedidosEmpleado`, `UsuarioForm` y `api.js`.

### Expresiones regulares

- La validación de correo se trasladó a `esEmailValido`, que valida la estructura mediante operaciones acotadas de cadenas.
- Se eliminaron las expresiones de correo repetidas en login, registro, inicio de sesión del cliente y modal de inicio de sesión.
- Se mantienen las validaciones de teléfono, NUIP y nombres sin cuantificadores anidados.

### Accesibilidad

- Se agregaron IDs estables y `htmlFor` a los controles de autenticación, usuarios, productos, checkout y perfil.
- Los campos dinámicos de pago y perfil también generan asociaciones explícitas entre etiqueta y control.
- El ordenamiento de categorías usa `localeCompare`, evitando el `sort()` sin comparador.

## Relación con las metas

| Indicador | Meta | Estado verificable |
|---|---:|---|
| Cumplimiento de requisitos | >= 95% | Requiere matriz de requisitos y evidencia funcional; no lo calcula SonarCloud. |
| Cobertura de pruebas | >= 80% | Pendiente: el frontend no tenía runner ni reporte de cobertura configurado. |
| Pruebas aprobadas | >= 95% | Las pruebas existentes son del backend; debe ejecutarse el conjunto completo y registrar aprobadas/fallidas. |
| Defectos críticos | 0 | Los hallazgos críticos visibles fueron corregidos en el código local; requiere nuevo análisis de SonarCloud para certificarlo. |
| Disponibilidad | >= 99% | Requiere monitoreo de despliegue/producción; no se puede inferir del análisis estático. |
| Satisfacción del usuario | >= 90% | Requiere encuesta o instrumento de aceptación; no es una métrica de SonarCloud. |

## Verificaciones ejecutadas

Desde `creaciones_camar`:

```text
npm run lint  -> termina sin errores; quedan 5 advertencias preexistentes de React/variables.
npm run build -> termina correctamente con Vite.
```

La advertencia de tamaño de chunks de Vite no está relacionada con los hallazgos de Sonar.

## Pasos para certificar las metas pendientes

1. Configurar Vitest o Jest en el frontend.
2. Crear pruebas para validaciones, autenticación, filtros, carrito, checkout y operaciones administrativas.
3. Generar `lcov.info` y conectarlo a SonarCloud mediante `sonar.javascript.lcov.reportPaths`.
4. Configurar el Quality Gate con cobertura >= 80%, duplicación controlada y cero defectos críticos.
5. Ejecutar un nuevo análisis en SonarCloud sobre el commit corregido.
6. Ejecutar pruebas de aceptación y una encuesta de satisfacción; registrar disponibilidad con monitoreo del entorno desplegado.

El estado final de SonarCloud debe actualizarse después de publicar estos cambios; el análisis remoto no cambia automáticamente por modificar el repositorio local.
