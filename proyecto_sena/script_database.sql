-- =====================================================
-- ESQUEMA LIMPIO - CREACIONES CAMAR
-- Compatible con el backend Spring Boot actual.
-- Elimina y recrea la base de datos sin usuarios, productos ni pedidos de prueba.
-- =====================================================

DROP DATABASE IF EXISTS mydb;
CREATE DATABASE mydb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE mydb;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE roles (
    id_rol BIGINT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    PRIMARY KEY (id_rol),
    UNIQUE KEY uq_roles_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE tipo_documentos (
    id_tipo BIGINT NOT NULL AUTO_INCREMENT,
    tipo VARCHAR(50) NOT NULL,
    PRIMARY KEY (id_tipo),
    UNIQUE KEY uq_tipo_documentos_tipo (tipo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE usuarios (
    id_usuario BIGINT NOT NULL AUTO_INCREMENT,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    nuip VARCHAR(15) NOT NULL,
    email VARCHAR(150) NOT NULL,
    telefono VARCHAR(20) NULL,
    password VARCHAR(255) NOT NULL,
    activo TINYINT(1) NOT NULL DEFAULT 1,
    fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    tipo_documento_id BIGINT NULL,
    PRIMARY KEY (id_usuario),
    UNIQUE KEY uq_usuarios_nuip (nuip),
    UNIQUE KEY uq_usuarios_email (email),
    KEY idx_usuarios_activo (activo),
    KEY idx_usuarios_tipo_documento (tipo_documento_id),
    CONSTRAINT fk_usuarios_tipo_documento FOREIGN KEY (tipo_documento_id) REFERENCES tipo_documentos (id_tipo)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE usuario_roles (
    usuario_id BIGINT NOT NULL,
    rol_id BIGINT NOT NULL,
    PRIMARY KEY (usuario_id, rol_id),
    CONSTRAINT fk_usuario_roles_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id_usuario)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_usuario_roles_rol FOREIGN KEY (rol_id) REFERENCES roles (id_rol)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE categorias (
    id_categoria BIGINT NOT NULL AUTO_INCREMENT,
    tipo_categoria VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255) NULL,
    activo TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (id_categoria),
    UNIQUE KEY uq_categorias_tipo (tipo_categoria),
    KEY idx_categorias_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    CREATE TABLE tallas (
        id_talla BIGINT NOT NULL AUTO_INCREMENT,
        nombre VARCHAR(20) NOT NULL,
        PRIMARY KEY (id_talla),
        UNIQUE KEY uq_tallas_nombre (nombre)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    CREATE TABLE monedas (
        id_moneda BIGINT NOT NULL AUTO_INCREMENT,
        codigo VARCHAR(3) NOT NULL,
        nombre VARCHAR(60) NOT NULL,
        PRIMARY KEY (id_moneda),
        UNIQUE KEY uq_monedas_codigo (codigo)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    CREATE TABLE paises (
        id_pais BIGINT NOT NULL AUTO_INCREMENT,
        nombre VARCHAR(80) NOT NULL,
        moneda_id BIGINT NOT NULL,
        PRIMARY KEY (id_pais),
        UNIQUE KEY uq_paises_nombre (nombre),
        CONSTRAINT fk_paises_moneda FOREIGN KEY (moneda_id) REFERENCES monedas (id_moneda)
            ON DELETE RESTRICT ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    CREATE TABLE ciudades (
        id_ciudad BIGINT NOT NULL AUTO_INCREMENT,
        nombre VARCHAR(100) NOT NULL,
        pais_id BIGINT NOT NULL,
        PRIMARY KEY (id_ciudad),
        UNIQUE KEY uq_ciudades_pais_nombre (pais_id, nombre),
        CONSTRAINT fk_ciudades_pais FOREIGN KEY (pais_id) REFERENCES paises (id_pais)
            ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    CREATE TABLE metodos_pago (
        id_metodo_pago BIGINT NOT NULL AUTO_INCREMENT,
        nombre VARCHAR(60) NOT NULL,
        activo TINYINT(1) NOT NULL DEFAULT 1,
        PRIMARY KEY (id_metodo_pago),
        UNIQUE KEY uq_metodos_pago_nombre (nombre)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE productos (
    id_producto BIGINT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT NULL,
    descripcion_corta VARCHAR(255) NULL,
    precio DECIMAL(10,2) NOT NULL,
    stock_total INT NOT NULL DEFAULT 0,
    imagen VARCHAR(500) NULL,
    categoria_id BIGINT NOT NULL,
    -- JSON: [{"talla":"S","cantidad":3},{"talla":"M","cantidad":8}]
    tallas TEXT NULL,
    activo TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (id_producto),
    KEY idx_productos_categoria (categoria_id),
    KEY idx_productos_activo (activo),
    CONSTRAINT ck_productos_precio CHECK (precio >= 0),
    CONSTRAINT ck_productos_stock CHECK (stock_total >= 0),
    CONSTRAINT fk_productos_categoria FOREIGN KEY (categoria_id) REFERENCES categorias (id_categoria)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    CREATE TABLE producto_tallas (
        producto_id BIGINT NOT NULL,
        talla_id BIGINT NOT NULL,
        cantidad INT NOT NULL DEFAULT 0,
        PRIMARY KEY (producto_id, talla_id),
        KEY idx_producto_tallas_talla (talla_id),
        CONSTRAINT ck_producto_tallas_cantidad CHECK (cantidad >= 0),
        CONSTRAINT fk_producto_tallas_producto FOREIGN KEY (producto_id) REFERENCES productos (id_producto)
            ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT fk_producto_tallas_talla FOREIGN KEY (talla_id) REFERENCES tallas (id_talla)
            ON DELETE RESTRICT ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
    pais_id BIGINT NULL,
    ciudad_id BIGINT NULL,
    metodo_pago_id BIGINT NULL,
    PRIMARY KEY (id_pedido),
    KEY idx_pedidos_usuario (usuario_id),
    KEY idx_pedidos_estado (estado),
    KEY idx_pedidos_fecha (fecha_pedido),
    KEY idx_pedidos_pais (pais_id),
    KEY idx_pedidos_ciudad (ciudad_id),
    KEY idx_pedidos_metodo_pago (metodo_pago_id),
    CONSTRAINT ck_pedidos_total CHECK (total >= 0),
    CONSTRAINT fk_pedidos_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id_usuario)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_pedidos_pais FOREIGN KEY (pais_id) REFERENCES paises (id_pais)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_pedidos_ciudad FOREIGN KEY (ciudad_id) REFERENCES ciudades (id_ciudad)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_pedidos_metodo_pago FOREIGN KEY (metodo_pago_id) REFERENCES metodos_pago (id_metodo_pago)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE detalle_pedidos (
    id_detalle BIGINT NOT NULL AUTO_INCREMENT,
    pedido_id BIGINT NOT NULL,
    producto_id BIGINT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    talla VARCHAR(20) NOT NULL,
    PRIMARY KEY (id_detalle),
    KEY idx_detalle_pedido (pedido_id),
    KEY idx_detalle_producto_talla (producto_id, talla),
    CONSTRAINT ck_detalle_cantidad CHECK (cantidad > 0),
    CONSTRAINT ck_detalle_precio CHECK (precio_unitario >= 0),
    CONSTRAINT fk_detalle_pedido FOREIGN KEY (pedido_id) REFERENCES pedidos (id_pedido)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_detalle_producto FOREIGN KEY (producto_id) REFERENCES productos (id_producto)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE carrito_items (
    id BIGINT NOT NULL AUTO_INCREMENT,
    usuario_id BIGINT NOT NULL,
    producto_id BIGINT NOT NULL,
    cantidad INT NOT NULL,
    talla VARCHAR(50) NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_carrito_usuario_producto_talla (usuario_id, producto_id, talla),
    KEY idx_carrito_usuario (usuario_id),
    CONSTRAINT ck_carrito_cantidad CHECK (cantidad > 0),
    CONSTRAINT fk_carrito_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id_usuario)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_carrito_producto FOREIGN KEY (producto_id) REFERENCES productos (id_producto)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- Datos mínimos de referencia para que los formularios puedan usarse.
INSERT INTO roles (nombre) VALUES ('admin'), ('empleado'), ('cliente');
INSERT INTO tipo_documentos (tipo) VALUES ('Cédula de ciudadanía'), ('Cédula de extranjería'), ('Pasaporte');
INSERT INTO tallas (nombre) VALUES ('XS'), ('S'), ('M'), ('L'), ('XL'), ('Única');
INSERT INTO monedas (codigo, nombre) VALUES
    ('ARS', 'Peso argentino'), ('BOB', 'Boliviano'), ('BRL', 'Real brasileño'),
    ('CLP', 'Peso chileno'), ('COP', 'Peso colombiano'), ('USD', 'Dólar estadounidense'),
    ('PYG', 'Guaraní paraguayo'), ('PEN', 'Sol peruano'), ('UYU', 'Peso uruguayo'),
    ('MXN', 'Peso mexicano');
INSERT INTO paises (nombre, moneda_id)
SELECT 'Argentina', id_moneda FROM monedas WHERE codigo = 'ARS'
UNION ALL SELECT 'Bolivia', id_moneda FROM monedas WHERE codigo = 'BOB'
UNION ALL SELECT 'Brasil', id_moneda FROM monedas WHERE codigo = 'BRL'
UNION ALL SELECT 'Chile', id_moneda FROM monedas WHERE codigo = 'CLP'
UNION ALL SELECT 'Colombia', id_moneda FROM monedas WHERE codigo = 'COP'
UNION ALL SELECT 'Ecuador', id_moneda FROM monedas WHERE codigo = 'USD'
UNION ALL SELECT 'Paraguay', id_moneda FROM monedas WHERE codigo = 'PYG'
UNION ALL SELECT 'Perú', id_moneda FROM monedas WHERE codigo = 'PEN'
UNION ALL SELECT 'Uruguay', id_moneda FROM monedas WHERE codigo = 'UYU'
UNION ALL SELECT 'México', id_moneda FROM monedas WHERE codigo = 'MXN';
INSERT INTO ciudades (nombre, pais_id)
SELECT ciudad.nombre, pais.id_pais FROM (
    SELECT 'Buenos Aires' nombre, 'Argentina' pais UNION ALL SELECT 'Córdoba', 'Argentina' UNION ALL SELECT 'Rosario', 'Argentina'
    UNION ALL SELECT 'La Paz', 'Bolivia' UNION ALL SELECT 'Santa Cruz de la Sierra', 'Bolivia' UNION ALL SELECT 'Cochabamba', 'Bolivia'
    UNION ALL SELECT 'São Paulo', 'Brasil' UNION ALL SELECT 'Río de Janeiro', 'Brasil' UNION ALL SELECT 'Brasilia', 'Brasil'
    UNION ALL SELECT 'Santiago', 'Chile' UNION ALL SELECT 'Valparaíso', 'Chile' UNION ALL SELECT 'Concepción', 'Chile'
    UNION ALL SELECT 'Bogotá', 'Colombia' UNION ALL SELECT 'Medellín', 'Colombia' UNION ALL SELECT 'Cali', 'Colombia' UNION ALL SELECT 'Barranquilla', 'Colombia' UNION ALL SELECT 'Cartagena', 'Colombia' UNION ALL SELECT 'Bucaramanga', 'Colombia'
    UNION ALL SELECT 'Quito', 'Ecuador' UNION ALL SELECT 'Guayaquil', 'Ecuador' UNION ALL SELECT 'Cuenca', 'Ecuador'
    UNION ALL SELECT 'Asunción', 'Paraguay' UNION ALL SELECT 'Ciudad del Este', 'Paraguay' UNION ALL SELECT 'Encarnación', 'Paraguay'
    UNION ALL SELECT 'Lima', 'Perú' UNION ALL SELECT 'Arequipa', 'Perú' UNION ALL SELECT 'Trujillo', 'Perú'
    UNION ALL SELECT 'Montevideo', 'Uruguay' UNION ALL SELECT 'Salto', 'Uruguay' UNION ALL SELECT 'Ciudad de la Costa', 'Uruguay'
    UNION ALL SELECT 'Ciudad de México', 'México' UNION ALL SELECT 'Guadalajara', 'México' UNION ALL SELECT 'Monterrey', 'México'
) ciudad JOIN paises pais ON pais.nombre = ciudad.pais;
INSERT INTO metodos_pago (nombre) VALUES ('Nequi'), ('Daviplata'), ('Transferencia Bancaria'), ('PayPal'), ('Mercado Pago');
INSERT INTO categorias (tipo_categoria, descripcion) VALUES
    ('Chaqueta de cuero', 'Chaquetas premium en cuero genuino'),
    ('Impermeables', 'Chaquetas resistentes al agua y clima extremo'),
    ('Acolchonadas', 'Chaquetas acolchadas para frío y abrigo'),
    ('Deportivas', 'Chaquetas cómodas para movimiento y estilo casual'),
    ('De denim', 'Chaquetas tipo jean con estilo versátil')
ON DUPLICATE KEY UPDATE descripcion = VALUES(descripcion), activo = 1;

INSERT INTO usuarios (nombres, apellidos, nuip, email, telefono, password, activo, tipo_documento_id) VALUES
    ('Admin', 'Sistema', '1000000001', 'admin@creacionescamar.com', '3000000000', 'admin123', 1,
        (SELECT id_tipo FROM tipo_documentos WHERE tipo = 'Cédula de ciudadanía')),
    ('Empleado', 'Principal', '1000000002', 'empleado@creacionescamar.com', '3000000001', 'empleado123', 1,
        (SELECT id_tipo FROM tipo_documentos WHERE tipo = 'Cédula de ciudadanía')),
    ('Cliente', 'Demo', '1000000003', 'cliente@creacionescamar.com', '3000000002', 'cliente123', 1,
        (SELECT id_tipo FROM tipo_documentos WHERE tipo = 'Cédula de ciudadanía'));

INSERT INTO usuario_roles (usuario_id, rol_id)
SELECT u.id_usuario, r.id_rol FROM usuarios u JOIN roles r ON r.nombre = 'admin'
WHERE u.email = 'admin@creacionescamar.com';
INSERT INTO usuario_roles (usuario_id, rol_id)
SELECT u.id_usuario, r.id_rol FROM usuarios u JOIN roles r ON r.nombre = 'empleado'
WHERE u.email = 'empleado@creacionescamar.com';
INSERT INTO usuario_roles (usuario_id, rol_id)
SELECT u.id_usuario, r.id_rol FROM usuarios u JOIN roles r ON r.nombre = 'cliente'
WHERE u.email = 'cliente@creacionescamar.com';

INSERT INTO productos (nombre, descripcion, descripcion_corta, precio, stock_total, categoria_id, tallas, activo) VALUES
    ('Chaqueta de Cuero Clásica', 'Chaqueta premium de cuero genuino con acabados refinados', 'Estilo premium para uso diario y eventos', 289000.00, 18,
        (SELECT id_categoria FROM categorias WHERE tipo_categoria = 'Chaqueta de cuero'),
        '[{"talla":"S","cantidad":4},{"talla":"M","cantidad":6},{"talla":"L","cantidad":5},{"talla":"XL","cantidad":3}]', 1),
    ('Impermeable Storm Pro', 'Chaqueta resistente al agua con diseño funcional y moderno', 'Ideal para lluvia y clima cambiante', 249000.00, 16,
        (SELECT id_categoria FROM categorias WHERE tipo_categoria = 'Impermeables'),
        '[{"talla":"S","cantidad":3},{"talla":"M","cantidad":5},{"talla":"L","cantidad":4},{"talla":"XL","cantidad":4}]', 1),
    ('Chaqueta Acolchonada Nova', 'Chaqueta acolchada para máximo abrigo sin perder estilo', 'Calidez y confort para días fríos', 265000.00, 14,
        (SELECT id_categoria FROM categorias WHERE tipo_categoria = 'Acolchonadas'),
        '[{"talla":"S","cantidad":3},{"talla":"M","cantidad":4},{"talla":"L","cantidad":4},{"talla":"XL","cantidad":3}]', 1),
    ('Chaqueta Deportiva Run', 'Chaqueta deportiva ligera, cómoda y versátil', 'Perfecta para actividades y uso casual', 199000.00, 20,
        (SELECT id_categoria FROM categorias WHERE tipo_categoria = 'Deportivas'),
        '[{"talla":"S","cantidad":5},{"talla":"M","cantidad":7},{"talla":"L","cantidad":5},{"talla":"XL","cantidad":3}]', 1),
    ('Chaqueta Denim Urban', 'Chaqueta tipo denim con estilo casual e industrial', 'Un clásico renovado para cada outfit', 219000.00, 17,
        (SELECT id_categoria FROM categorias WHERE tipo_categoria = 'De denim'),
        '[{"talla":"S","cantidad":4},{"talla":"M","cantidad":5},{"talla":"L","cantidad":4},{"talla":"XL","cantidad":4}]', 1);

INSERT INTO producto_tallas (producto_id, talla_id, cantidad)
SELECT p.id_producto, t.id_talla, 4 FROM productos p JOIN tallas t ON t.nombre = 'S' WHERE p.nombre = 'Chaqueta de Cuero Clásica'
UNION ALL SELECT p.id_producto, t.id_talla, 6 FROM productos p JOIN tallas t ON t.nombre = 'M' WHERE p.nombre = 'Chaqueta de Cuero Clásica'
UNION ALL SELECT p.id_producto, t.id_talla, 5 FROM productos p JOIN tallas t ON t.nombre = 'L' WHERE p.nombre = 'Chaqueta de Cuero Clásica'
UNION ALL SELECT p.id_producto, t.id_talla, 3 FROM productos p JOIN tallas t ON t.nombre = 'XL' WHERE p.nombre = 'Chaqueta de Cuero Clásica'
UNION ALL SELECT p.id_producto, t.id_talla, 3 FROM productos p JOIN tallas t ON t.nombre = 'S' WHERE p.nombre = 'Impermeable Storm Pro'
UNION ALL SELECT p.id_producto, t.id_talla, 5 FROM productos p JOIN tallas t ON t.nombre = 'M' WHERE p.nombre = 'Impermeable Storm Pro'
UNION ALL SELECT p.id_producto, t.id_talla, 4 FROM productos p JOIN tallas t ON t.nombre = 'L' WHERE p.nombre = 'Impermeable Storm Pro'
UNION ALL SELECT p.id_producto, t.id_talla, 4 FROM productos p JOIN tallas t ON t.nombre = 'XL' WHERE p.nombre = 'Impermeable Storm Pro'
UNION ALL SELECT p.id_producto, t.id_talla, 3 FROM productos p JOIN tallas t ON t.nombre = 'S' WHERE p.nombre = 'Chaqueta Acolchonada Nova'
UNION ALL SELECT p.id_producto, t.id_talla, 4 FROM productos p JOIN tallas t ON t.nombre = 'M' WHERE p.nombre = 'Chaqueta Acolchonada Nova'
UNION ALL SELECT p.id_producto, t.id_talla, 4 FROM productos p JOIN tallas t ON t.nombre = 'L' WHERE p.nombre = 'Chaqueta Acolchonada Nova'
UNION ALL SELECT p.id_producto, t.id_talla, 3 FROM productos p JOIN tallas t ON t.nombre = 'XL' WHERE p.nombre = 'Chaqueta Acolchonada Nova'
UNION ALL SELECT p.id_producto, t.id_talla, 5 FROM productos p JOIN tallas t ON t.nombre = 'S' WHERE p.nombre = 'Chaqueta Deportiva Run'
UNION ALL SELECT p.id_producto, t.id_talla, 7 FROM productos p JOIN tallas t ON t.nombre = 'M' WHERE p.nombre = 'Chaqueta Deportiva Run'
UNION ALL SELECT p.id_producto, t.id_talla, 5 FROM productos p JOIN tallas t ON t.nombre = 'L' WHERE p.nombre = 'Chaqueta Deportiva Run'
UNION ALL SELECT p.id_producto, t.id_talla, 3 FROM productos p JOIN tallas t ON t.nombre = 'XL' WHERE p.nombre = 'Chaqueta Deportiva Run'
UNION ALL SELECT p.id_producto, t.id_talla, 4 FROM productos p JOIN tallas t ON t.nombre = 'S' WHERE p.nombre = 'Chaqueta Denim Urban'
UNION ALL SELECT p.id_producto, t.id_talla, 5 FROM productos p JOIN tallas t ON t.nombre = 'M' WHERE p.nombre = 'Chaqueta Denim Urban'
UNION ALL SELECT p.id_producto, t.id_talla, 4 FROM productos p JOIN tallas t ON t.nombre = 'L' WHERE p.nombre = 'Chaqueta Denim Urban'
UNION ALL SELECT p.id_producto, t.id_talla, 4 FROM productos p JOIN tallas t ON t.nombre = 'XL' WHERE p.nombre = 'Chaqueta Denim Urban';

SELECT 'Esquema de mydb creado correctamente.' AS estado;
