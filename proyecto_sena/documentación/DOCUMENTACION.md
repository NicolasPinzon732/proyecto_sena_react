# Documentación - Proyecto Creaciones Camar

## Resumen General
Este documento describe la arquitectura y la estructura del proyecto que ha sido adaptado a React en el frontend y Spring Boot en el backend.

---

## 📦 Backend - Spring Boot

### Estructura de Carpetas
```
demo/src/main/java/com/creaciones_camar/demo/
├── model/              # Entidades JPA
│   ├── Usuario.java
│   ├── Producto.java
│   ├── Categoria.java
│   ├── Material.java
│   ├── Pedido.java
│   ├── DetallePedido.java
│   ├── ItemCarrito.java
│   ├── Inventario.java
│   └── TipoDocumento.java
├── repository/         # Interfaces de acceso a datos
│   ├── UsuarioRepository.java
│   ├── ProductoRepository.java
│   ├── CategoriaRepository.java
│   ├── MaterialRepository.java
│   ├── PedidoRepository.java
│   ├── DetallePedidoRepository.java
│   ├── ItemCarritoRepository.java
│   ├── InventarioRepository.java
│   └── TipoDocumentoRepository.java
├── service/            # Lógica de negocio
│   ├── UsuarioService.java
│   ├── ProductoService.java
│   ├── CategoriaService.java
│   ├── MaterialService.java
│   ├── PedidoService.java
│   └── ItemCarritoService.java
├── controller/         # Controladores REST
│   ├── UsuarioController.java
│   ├── ProductoController.java
│   ├── CategoriaController.java
│   ├── MaterialController.java
│   ├── PedidoController.java
│   └── ItemCarritoController.java
└── DemoApplication.java
```

### Endpoints API

#### Usuarios
- `POST /api/usuarios` - Crear usuario
- `GET /api/usuarios` - Obtener todos los usuarios
- `GET /api/usuarios/{id}` - Obtener usuario por ID
- `GET /api/usuarios/email/{email}` - Obtener usuario por email
- `GET /api/usuarios/rol/{rol}` - Obtener usuarios por rol
- `GET /api/usuarios/activos` - Obtener usuarios activos
- `PUT /api/usuarios/{id}` - Actualizar usuario
- `DELETE /api/usuarios/{id}` - Eliminar (desactivar) usuario
- `PUT /api/usuarios/{id}/activar` - Activar usuario
- `PUT /api/usuarios/{id}/desactivar` - Desactivar usuario

#### Productos
- `POST /api/productos` - Crear producto
- `GET /api/productos` - Obtener todos los productos
- `GET /api/productos/{id}` - Obtener producto por ID
- `GET /api/productos/activos` - Obtener productos activos
- `GET /api/productos/categoria/{categoriaId}` - Obtener productos por categoría
- `GET /api/productos/buscar?nombre={nombre}` - Buscar productos
- `PUT /api/productos/{id}` - Actualizar producto
- `DELETE /api/productos/{id}` - Eliminar (desactivar) producto
- `PUT /api/productos/{id}/activar` - Activar producto
- `PUT /api/productos/{id}/desactivar` - Desactivar producto

#### Categorías
- `POST /api/categorias` - Crear categoría
- `GET /api/categorias` - Obtener todas las categorías
- `GET /api/categorias/{id}` - Obtener categoría por ID
- `GET /api/categorias/activas` - Obtener categorías activas
- `PUT /api/categorias/{id}` - Actualizar categoría
- `DELETE /api/categorias/{id}` - Eliminar (desactivar) categoría

#### Materiales
- `POST /api/materiales` - Crear material
- `GET /api/materiales` - Obtener todos los materiales
- `GET /api/materiales/{id}` - Obtener material por ID
- `GET /api/materiales/activos` - Obtener materiales activos
- `GET /api/materiales/buscar?nombre={nombre}` - Buscar materiales
- `PUT /api/materiales/{id}` - Actualizar material
- `DELETE /api/materiales/{id}` - Eliminar (desactivar) material
- `PUT /api/materiales/{id}/desactivar` - Desactivar material

#### Pedidos
- `POST /api/pedidos` - Crear pedido
- `GET /api/pedidos` - Obtener todos los pedidos
- `GET /api/pedidos/{id}` - Obtener pedido por ID
- `GET /api/pedidos/usuario/{usuarioId}` - Obtener pedidos de un usuario
- `GET /api/pedidos/estado/{estado}` - Obtener pedidos por estado
- `PUT /api/pedidos/{id}` - Actualizar pedido
- `DELETE /api/pedidos/{id}` - Eliminar pedido
- `PUT /api/pedidos/{id}/estado/{estado}` - Cambiar estado de pedido

#### Carrito
- `POST /api/carrito` - Agregar producto al carrito
- `GET /api/carrito/{id}` - Obtener item del carrito
- `GET /api/carrito/usuario/{usuarioId}` - Obtener carrito de usuario
- `GET /api/carrito/buscar?usuarioId=...&productoId=...&talla=...` - Buscar item específico
- `PUT /api/carrito/{id}?cantidad={cantidad}` - Actualizar cantidad
- `DELETE /api/carrito/{id}` - Eliminar del carrito
- `DELETE /api/carrito/usuario/{usuarioId}` - Vaciar carrito

---

## 🎨 Frontend - React

### Estructura de Carpetas
```
creaciones_camar/src/
├── view/
│   ├── admin/                          # Componentes de administración
│   │   ├── AdminDashboard.jsx
│   │   ├── UsuariosList.jsx
│   │   ├── UsuarioForm.jsx
│   │   ├── ProductosList.jsx
│   │   ├── ProductoForm.jsx
│   │   ├── MaterialesList.jsx
│   │   ├── MaterialForm.jsx
│   │   └── PedidosList.jsx
│   ├── cliente/                        # Componentes de cliente
│   │   ├── CatalogoClie.jsx
│   │   ├── DetalleProducto.jsx
│   │   ├── CarritoClie.jsx
│   │   ├── CheckoutClie.jsx
│   │   └── PedidosClie.jsx
│   ├── empleado/                       # Componentes de empleado
│   │   ├── EmpleadoDashboard.jsx
│   │   ├── PedidosEmpleado.jsx
│   │   └── MaterialesEmpleado.jsx
│   ├── auth/                           # Componentes de autenticación
│   │   ├── LoginForm.jsx
│   │   └── RegisterForm.jsx
│   └── ... (archivos existentes)
├── auth/
│   └── ProtectedRoute.jsx             # Componente para rutas protegidas
├── AppRoutes.jsx                       # Definición de rutas
├── App.jsx                             # Componente principal
├── index.jsx
└── style.css
```

### Rutas Disponibles

#### Rutas Públicas
- `/login` - Página de inicio de sesión
- `/register` - Página de registro

#### Admin (Requiere rol "admin")
- `/admin` - Dashboard administrativo
- `/admin/usuarios` - Listado de usuarios
- `/admin/usuarios/crear` - Crear nuevo usuario
- `/admin/usuarios/:id/editar` - Editar usuario
- `/admin/productos` - Listado de productos
- `/admin/productos/crear` - Crear nuevo producto
- `/admin/productos/:id/editar` - Editar producto
- `/admin/materiales` - Listado de materiales
- `/admin/materiales/crear` - Crear nuevo material
- `/admin/materiales/:id/editar` - Editar material
- `/admin/pedidos` - Listado de pedidos

#### Cliente (Accesible para clientes)
- `/cliente/catalogo` - Catálogo de productos
- `/cliente/producto/:id` - Detalle de producto
- `/cliente/carrito` - Carrito de compras
- `/cliente/checkout` - Procesar compra
- `/cliente/pedidos` - Mis pedidos

#### Empleado (Requiere rol "empleado")
- `/empleado` - Dashboard de empleado
- `/empleado/pedidos` - Gestión de pedidos
- `/empleado/materiales` - Control de materiales

---

## 🔐 Autenticación y Seguridad

### Sistema de Autenticación
- Los usuarios se autentican a través del formulario de login
- Las credenciales se validan contra la base de datos en Spring Boot
- Al autenticar exitosamente, se almacena el usuario en `localStorage`
- Las rutas están protegidas según el rol del usuario

### Roles Disponibles
1. **admin** - Acceso total al panel administrativo
2. **cliente** - Acceso al catálogo, carrito y gestión de pedidos
3. **empleado** - Acceso a gestión de pedidos y control de materiales

---

## 🚀 Cómo Iniciar

### Backend (Spring Boot)
```bash
cd demo
mvn spring-boot:run
# Se ejecutará en http://localhost:8080
```

### Frontend (React)
```bash
cd creaciones_camar
npm install
npm run dev
# Se ejecutará en http://localhost:5173
```

---

## 📝 Notas Importantes

1. **No se ha modificado el componente Home/Index**: Como solicitaste, la página de inicio está siendo desarrollada por tu compañero.

2. **Base de Datos**: El archivo `.mwb` (MySQL Workbench) contiene el esquema de la base de datos. Las entidades Spring Boot están diseñadas para corresponder con esa estructura.

3. **CORS**: Los controladores en Spring Boot tienen `@CrossOrigin(origins = "*")` para permitir peticiones desde React. En producción, debes especificar los orígenes permitidos.

4. **Validación**: La validación actual es básica. Para producción, agrega validaciones más robustas en backend y frontend.

5. **Encriptación de Contraseñas**: En producción, debes encriptar las contraseñas usando BCrypt en lugar de guardarlas en texto plano.

---

## 🔧 Configuraciones Necesarias

### Variables de Entorno (Backend)
En `application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/creaciones_camar
spring.datasource.username=root
spring.datasource.password=
spring.jpa.hibernate.ddl-auto=update
```

### Variables de Entorno (Frontend)
La URL de la API está hardcodeada como `http://localhost:8080`. Para cambiarla, busca y reemplaza en todos los componentes.

---

## ✅ Estado del Proyecto

✅ Modelos JPA creados  
✅ Repositories implementados  
✅ Services con lógica de negocio  
✅ Controllers REST completamente funcionales  
✅ Componentes React para Admin  
✅ Componentes React para Cliente  
✅ Componentes React para Empleado  
✅ Sistema de autenticación  
✅ Rutas protegidas  
✅ Integración Frontend-Backend  

⏳ Pendiente por tu compañero:  
- Página de inicio/Home  
- Integración final con la página principal  

---

## 📞 Soporte

Para cualquier pregunta o necesidad de ajustes, consulta la estructura del código y los comentarios en cada componente.

**Proyecto completado exitosamente** ✨
