# GUÍA RÁPIDA DE URLS - PROYECTO CREACIONES CAMAR

## 🌐 URLs de Desarrollo

### Backend
- **Base URL**: http://localhost:8080
- **Documentación**: Consultar archivos de Controllers

### Frontend  
- **Base URL**: http://localhost:5173
- **Ruta por defecto**: http://localhost:5173/ → Redirige a /cliente/catalogo

---

## 🔑 Usuarios de Prueba

### Admin
```
Email: admin@creacionescamar.com
Contraseña: admin123
Rol: admin
```

### Empleado
```
Email: empleado@creacionescamar.com
Contraseña: empleado123
Rol: empleado
```

### Cliente
```
Email: cliente@creacionescamar.com
Contraseña: cliente123
Rol: cliente
```

---

## 📱 Rutas Frontend

### Públicas (Sin login)
```
http://localhost:5173/login                    → Inicio de sesión
http://localhost:5173/register                 → Registro de nuevo usuario
http://localhost:5173/cliente/catalogo         → Catálogo de productos
http://localhost:5173/cliente/producto/1       → Detalle del producto
http://localhost:5173/cliente/carrito          → Carrito de compras
```

### Rutas Admin (Requiere rol admin)
```
http://localhost:5173/admin                    → Dashboard
http://localhost:5173/admin/usuarios           → Listado de usuarios
http://localhost:5173/admin/usuarios/crear     → Crear usuario
http://localhost:5173/admin/usuarios/1/editar  → Editar usuario
http://localhost:5173/admin/productos          → Listado de productos
http://localhost:5173/admin/productos/crear    → Crear producto
http://localhost:5173/admin/productos/1/editar → Editar producto
http://localhost:5173/admin/materiales         → Listado de materiales
http://localhost:5173/admin/materiales/crear   → Crear material
http://localhost:5173/admin/materiales/1/editar→ Editar material
http://localhost:5173/admin/pedidos            → Listado de pedidos
```

### Rutas Cliente
```
http://localhost:5173/cliente/catalogo         → Catálogo
http://localhost:5173/cliente/producto/1       → Detalle de producto
http://localhost:5173/cliente/carrito          → Carrito (requiere login)
http://localhost:5173/cliente/checkout         → Checkout (requiere login)
http://localhost:5173/cliente/pedidos          → Mis pedidos (requiere login)
```

### Rutas Empleado (Requiere rol empleado)
```
http://localhost:5173/empleado                 → Dashboard
http://localhost:5173/empleado/pedidos         → Gestión de pedidos
http://localhost:5173/empleado/materiales      → Control de materiales
```

---

## 🔌 Endpoints API Backend

### Usuarios
```
GET    http://localhost:8080/api/usuarios
GET    http://localhost:8080/api/usuarios/1
GET    http://localhost:8080/api/usuarios/email/admin@mail.com
GET    http://localhost:8080/api/usuarios/rol/admin
GET    http://localhost:8080/api/usuarios/activos
POST   http://localhost:8080/api/usuarios
PUT    http://localhost:8080/api/usuarios/1
DELETE http://localhost:8080/api/usuarios/1
PUT    http://localhost:8080/api/usuarios/1/activar
PUT    http://localhost:8080/api/usuarios/1/desactivar
```

### Productos
```
GET    http://localhost:8080/api/productos
GET    http://localhost:8080/api/productos/1
GET    http://localhost:8080/api/productos/activos
GET    http://localhost:8080/api/productos/categoria/1
GET    http://localhost:8080/api/productos/buscar?nombre=chaqueta
POST   http://localhost:8080/api/productos
PUT    http://localhost:8080/api/productos/1
DELETE http://localhost:8080/api/productos/1
PUT    http://localhost:8080/api/productos/1/activar
PUT    http://localhost:8080/api/productos/1/desactivar
```

### Categorías
```
GET    http://localhost:8080/api/categorias
GET    http://localhost:8080/api/categorias/1
GET    http://localhost:8080/api/categorias/activas
POST   http://localhost:8080/api/categorias
PUT    http://localhost:8080/api/categorias/1
DELETE http://localhost:8080/api/categorias/1
```

### Materiales
```
GET    http://localhost:8080/api/materiales
GET    http://localhost:8080/api/materiales/1
GET    http://localhost:8080/api/materiales/activos
GET    http://localhost:8080/api/materiales/buscar?nombre=algodón
POST   http://localhost:8080/api/materiales
PUT    http://localhost:8080/api/materiales/1
DELETE http://localhost:8080/api/materiales/1
PUT    http://localhost:8080/api/materiales/1/desactivar
```

### Pedidos
```
GET    http://localhost:8080/api/pedidos
GET    http://localhost:8080/api/pedidos/1
GET    http://localhost:8080/api/pedidos/usuario/1
GET    http://localhost:8080/api/pedidos/estado/pendiente
POST   http://localhost:8080/api/pedidos
PUT    http://localhost:8080/api/pedidos/1
DELETE http://localhost:8080/api/pedidos/1
PUT    http://localhost:8080/api/pedidos/1/estado/confirmado
```

### Carrito
```
GET    http://localhost:8080/api/carrito/1
GET    http://localhost:8080/api/carrito/usuario/1
GET    http://localhost:8080/api/carrito/buscar?usuarioId=1&productoId=1&talla=M
POST   http://localhost:8080/api/carrito
PUT    http://localhost:8080/api/carrito/1?cantidad=2
DELETE http://localhost:8080/api/carrito/1
DELETE http://localhost:8080/api/carrito/usuario/1
```

---

## 🧪 Ejemplos de JSON para Requests

### POST /api/usuarios
```json
{
  "idUsuario": "user123",
  "nombres": "Juan",
  "apellidos": "Pérez",
  "email": "juan@mail.com",
  "telefono": "3001234567",
  "password": "password123",
  "rol": "cliente",
  "tipoDocumento": {
    "idTipo": 1
  }
}
```

### POST /api/productos
```json
{
  "nombre": "Chaqueta Clásica",
  "descripcion": "Chaqueta elegante para cualquier ocasión",
  "descripcionCorta": "Elegante",
  "precio": 89.99,
  "stockTotal": 50,
  "imagen": "https://ejemplo.com/imagen.jpg",
  "tallas": "XS,S,M,L,XL,XXL",
  "categoria": {
    "id": 1
  }
}
```

### POST /api/materiales
```json
{
  "nombre": "Algodón Premium",
  "proveedor": "Textiles S.A.",
  "precio": 15.50,
  "cantidad": 100,
  "descripcion": "Algodón de alta calidad"
}
```

### POST /api/pedidos
```json
{
  "usuario": {
    "id": 1
  },
  "total": 150.00,
  "estado": "pendiente",
  "pais": "Colombia",
  "ciudad": "Bogotá",
  "direccion": "Calle 15 #20-35",
  "codigoPostal": "110111"
}
```

### POST /api/carrito
```json
{
  "usuario": {
    "id": 1
  },
  "producto": {
    "id": 1
  },
  "cantidad": 1,
  "talla": "M"
}
```

---

## 🛠️ Troubleshooting

### Error de conexión a BD
```
Verificar:
- MySQL está corriendo
- Credenciales en application.properties
- Base de datos "creaciones_camar" existe
```

### CORS Error en consola
```
Normal en desarrollo. El backend tiene:
@CrossOrigin(origins = "*")
En producción restringir a orígenes específicos
```

### Puerto en uso
```
Backend: lsof -i :8080 (Linux/Mac) o netstat -ano (Windows)
Frontend: npm run dev -- --port 3000
```

---

## 📊 Estados de Pedido

Transiciones válidas:
```
pendiente → confirmado → enviado → entregado
         ↘ cancelado
```

---

**Última actualización:** 31 de Agosto de 2026
