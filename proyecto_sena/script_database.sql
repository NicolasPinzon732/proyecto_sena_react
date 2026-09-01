
-- =====================================================
-- BASE DE DATOS MYDB - DISEÑO ROBUSTO PARA CREACIONES CAMAR
-- =====================================================

DROP DATABASE IF EXISTS mydb;
CREATE DATABASE mydb
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE mydb;

-- =====================================================
-- LIMPIEZA PARA PHPMyAdmin / EJECUCIONES REPETIDAS
-- =====================================================
DROP TABLE IF EXISTS detalle_pedidos;
DROP TABLE IF EXISTS pedidos;
DROP TABLE IF EXISTS productos;
DROP TABLE IF EXISTS categorias;
DROP TABLE IF EXISTS usuario_roles;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS usuarios;

-- =====================================================
-- TABLA: usuarios
-- =====================================================
CREATE TABLE usuarios (
    id_usuario BIGINT NOT NULL AUTO_INCREMENT,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    telefono VARCHAR(20) NULL,
    password VARCHAR(255) NOT NULL,
    activo TINYINT(1) NOT NULL DEFAULT 1,
    fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_usuario),
    UNIQUE KEY uq_usuarios_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLA: roles
-- =====================================================
CREATE TABLE roles (
    id_rol BIGINT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    PRIMARY KEY (id_rol),
    UNIQUE KEY uq_roles_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLA: usuario_roles
-- =====================================================
CREATE TABLE usuario_roles (
    usuario_id BIGINT NOT NULL,
    rol_id BIGINT NOT NULL,
    PRIMARY KEY (usuario_id, rol_id),
    KEY idx_usuario_roles_usuario (usuario_id),
    KEY idx_usuario_roles_rol (rol_id),
    CONSTRAINT fk_usuario_roles_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios (id_usuario)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_usuario_roles_rol
        FOREIGN KEY (rol_id) REFERENCES roles (id_rol)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLA: categorias
-- =====================================================
CREATE TABLE categorias (
    id_categoria BIGINT NOT NULL AUTO_INCREMENT,
    tipo_categoria VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255) NULL,
    activo TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (id_categoria),
    UNIQUE KEY uq_categorias_tipo (tipo_categoria)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLA: productos
-- =====================================================
CREATE TABLE productos (
    id_producto BIGINT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT NULL,
    descripcion_corta VARCHAR(255) NULL,
    precio DECIMAL(10,2) NOT NULL,
    stock_total INT NOT NULL DEFAULT 0,
    imagen VARCHAR(500) NULL,
    categoria_id BIGINT NOT NULL,
    tallas TEXT NULL,
    activo TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (id_producto),
    KEY idx_productos_categoria (categoria_id),
    CONSTRAINT fk_productos_categoria
        FOREIGN KEY (categoria_id) REFERENCES categorias (id_categoria)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLA: pedidos
-- =====================================================
CREATE TABLE pedidos (
    id_pedido BIGINT NOT NULL AUTO_INCREMENT,
    usuario_id BIGINT NOT NULL,
    fecha_pedido DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10,2) NOT NULL,
    estado VARCHAR(30) NOT NULL DEFAULT 'pendiente',
    pais VARCHAR(100) NULL,
    ciudad VARCHAR(100) NULL,
    direccion VARCHAR(255) NULL,
    codigo_postal VARCHAR(20) NULL,
    PRIMARY KEY (id_pedido),
    KEY idx_pedidos_usuario (usuario_id),
    CONSTRAINT fk_pedidos_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios (id_usuario)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLA: detalle_pedidos
-- =====================================================
CREATE TABLE detalle_pedidos (
    id_detalle BIGINT NOT NULL AUTO_INCREMENT,
    pedido_id BIGINT NOT NULL,
    producto_id BIGINT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    talla VARCHAR(20) NULL,
    PRIMARY KEY (id_detalle),
    KEY idx_detalle_pedido (pedido_id),
    KEY idx_detalle_producto (producto_id),
    CONSTRAINT fk_detalle_pedido
        FOREIGN KEY (pedido_id) REFERENCES pedidos (id_pedido)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_detalle_producto
        FOREIGN KEY (producto_id) REFERENCES productos (id_producto)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- INSERTS INICIALES
-- =====================================================
INSERT INTO roles (nombre) VALUES
    ('admin'),
    ('empleado'),
    ('cliente')
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);

INSERT INTO usuarios (nombres, apellidos, email, telefono, password, activo) VALUES
    ('Admin', 'Sistema', 'admin@creacionescamar.com', '3000000000', 'admin123', 1),
    ('Empleado', 'Principal', 'empleado@creacionescamar.com', '3000000001', 'empleado123', 1),
    ('Cliente', 'Demo', 'cliente@creacionescamar.com', '3000000002', 'cliente123', 1)
ON DUPLICATE KEY UPDATE
    nombres = VALUES(nombres),
    apellidos = VALUES(apellidos),
    telefono = VALUES(telefono),
    password = VALUES(password),
    activo = VALUES(activo);

INSERT INTO usuario_roles (usuario_id, rol_id)
SELECT u.id_usuario, r.id_rol
FROM usuarios u
JOIN roles r ON r.nombre = 'admin'
WHERE u.email = 'admin@creacionescamar.com'
ON DUPLICATE KEY UPDATE rol_id = rol_id;

INSERT INTO usuario_roles (usuario_id, rol_id)
SELECT u.id_usuario, r.id_rol
FROM usuarios u
JOIN roles r ON r.nombre = 'empleado'
WHERE u.email = 'empleado@creacionescamar.com'
ON DUPLICATE KEY UPDATE rol_id = rol_id;

INSERT INTO usuario_roles (usuario_id, rol_id)
SELECT u.id_usuario, r.id_rol
FROM usuarios u
JOIN roles r ON r.nombre = 'cliente'
WHERE u.email = 'cliente@creacionescamar.com'
ON DUPLICATE KEY UPDATE rol_id = rol_id;

INSERT INTO categorias (tipo_categoria, descripcion, activo) VALUES
    ('Chaquetas', 'Prendas de abrigo y estilo moderno', 1),
    ('Pantalones', 'Pantalones casuales y formales', 1),
    ('Accesorios', 'Accesorios complementarios', 1)
ON DUPLICATE KEY UPDATE descripcion = VALUES(descripcion), activo = VALUES(activo);

INSERT INTO productos (nombre, descripcion, descripcion_corta, precio, stock_total, categoria_id, tallas, activo) VALUES
    ('Chaqueta Urbana', 'Chaqueta moderna para uso diario', 'Ideal para clima fresco', 189000.00, 20, 1, 'S,M,L,XL', 1),
    ('Pantalón Clásico', 'Pantalón cómodo y elegante', 'Versátil para cualquier ocasión', 129000.00, 30, 2, 'S,M,L,XL', 1),
    ('Cinturón Premium', 'Accesorio de alta calidad', 'Detalle final para cada outfit', 45000.00, 50, 3, 'Única', 1)
ON DUPLICATE KEY UPDATE
    descripcion = VALUES(descripcion),
    descripcion_corta = VALUES(descripcion_corta),
    precio = VALUES(precio),
    stock_total = VALUES(stock_total),
    categoria_id = VALUES(categoria_id),
    tallas = VALUES(tallas),
    activo = VALUES(activo);

SELECT 'Base de datos creada correctamente.' AS estado;

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================


