-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 16-09-2026 a las 18:25:56
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `mydb`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carrito_items`
--

CREATE TABLE `carrito_items` (
  `id` bigint(20) NOT NULL,
  `usuario_id` bigint(20) NOT NULL,
  `producto_id` bigint(20) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `talla` varchar(50) DEFAULT NULL
) ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id_categoria` bigint(20) NOT NULL,
  `tipo_categoria` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id_categoria`, `tipo_categoria`, `descripcion`, `activo`) VALUES
(1, 'Cuero', 'Chaquetas premium en cuero genuino', 1),
(2, 'Impermeables', 'Chaquetas resistentes al agua y clima extremo', 1),
(3, 'Acolchonadas', 'Chaquetas acolchadas para frío y abrigo', 1),
(4, 'Deportivas', 'Chaquetas cómodas para movimiento y estilo casual', 1),
(5, 'Demin', 'Chaquetas tipo denim con estilo versátil', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ciudades`
--

CREATE TABLE `ciudades` (
  `id_ciudad` bigint(20) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `pais_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `ciudades`
--

INSERT INTO `ciudades` (`id_ciudad`, `nombre`, `pais_id`) VALUES
(1, 'Buenos Aires', 1),
(2, 'Córdoba', 1),
(3, 'Rosario', 1),
(6, 'Cochabamba', 2),
(4, 'La Paz', 2),
(5, 'Santa Cruz de la Sierra', 2),
(9, 'Brasilia', 3),
(8, 'Río de Janeiro', 3),
(7, 'São Paulo', 3),
(12, 'Concepción', 4),
(10, 'Santiago', 4),
(11, 'Valparaíso', 4),
(16, 'Barranquilla', 5),
(13, 'Bogotá', 5),
(18, 'Bucaramanga', 5),
(15, 'Cali', 5),
(17, 'Cartagena', 5),
(14, 'Medellín', 5),
(21, 'Cuenca', 6),
(20, 'Guayaquil', 6),
(19, 'Quito', 6),
(22, 'Asunción', 7),
(23, 'Ciudad del Este', 7),
(24, 'Encarnación', 7),
(26, 'Arequipa', 8),
(25, 'Lima', 8),
(27, 'Trujillo', 8),
(30, 'Ciudad de la Costa', 9),
(28, 'Montevideo', 9),
(29, 'Salto', 9),
(31, 'Ciudad de México', 10),
(32, 'Guadalajara', 10),
(33, 'Monterrey', 10);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_pedidos`
--

CREATE TABLE `detalle_pedidos` (
  `id_detalle` bigint(20) NOT NULL,
  `pedido_id` bigint(20) NOT NULL,
  `producto_id` bigint(20) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `talla` varchar(20) NOT NULL
) ;

--
-- Volcado de datos para la tabla `detalle_pedidos`
--

INSERT INTO `detalle_pedidos` (`id_detalle`, `pedido_id`, `producto_id`, `cantidad`, `precio_unitario`, `talla`) VALUES
(1, 1, 1, 1, 180000.00, 'M'),
(2, 1, 3, 1, 265000.00, 'M'),
(3, 2, 2, 1, 219997.00, 'S'),
(4, 3, 20, 5, 123000.00, 's'),
(5, 4, 6, 3, 240000.00, 'XS');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `metodos_pago`
--

CREATE TABLE `metodos_pago` (
  `id_metodo_pago` bigint(20) NOT NULL,
  `nombre` varchar(60) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `metodos_pago`
--

INSERT INTO `metodos_pago` (`id_metodo_pago`, `nombre`, `activo`) VALUES
(1, 'Nequi', 1),
(2, 'Daviplata', 1),
(3, 'Transferencia Bancaria', 1),
(4, 'PayPal', 1),
(5, 'Mercado Pago', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `monedas`
--

CREATE TABLE `monedas` (
  `id_moneda` bigint(20) NOT NULL,
  `codigo` varchar(3) NOT NULL,
  `nombre` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `monedas`
--

INSERT INTO `monedas` (`id_moneda`, `codigo`, `nombre`) VALUES
(1, 'ARS', 'Peso argentino'),
(2, 'BOB', 'Boliviano'),
(3, 'BRL', 'Real brasileño'),
(4, 'CLP', 'Peso chileno'),
(5, 'COP', 'Peso colombiano'),
(6, 'USD', 'Dólar estadounidense'),
(7, 'PYG', 'Guaraní paraguayo'),
(8, 'PEN', 'Sol peruano'),
(9, 'UYU', 'Peso uruguayo'),
(10, 'MXN', 'Peso mexicano');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `paises`
--

CREATE TABLE `paises` (
  `id_pais` bigint(20) NOT NULL,
  `nombre` varchar(80) NOT NULL,
  `moneda_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `paises`
--

INSERT INTO `paises` (`id_pais`, `nombre`, `moneda_id`) VALUES
(1, 'Argentina', 1),
(2, 'Bolivia', 2),
(3, 'Brasil', 3),
(4, 'Chile', 4),
(5, 'Colombia', 5),
(6, 'Ecuador', 6),
(7, 'Paraguay', 7),
(8, 'Perú', 8),
(9, 'Uruguay', 9),
(10, 'México', 10);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

CREATE TABLE `pedidos` (
  `id_pedido` bigint(20) NOT NULL,
  `usuario_id` bigint(20) NOT NULL,
  `fecha_pedido` datetime NOT NULL DEFAULT current_timestamp(),
  `total` decimal(10,2) NOT NULL,
  `estado` varchar(30) NOT NULL DEFAULT 'pendiente',
  `pais` varchar(100) DEFAULT NULL,
  `ciudad` varchar(100) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `codigo_postal` varchar(20) DEFAULT NULL,
  `pais_id` bigint(20) DEFAULT NULL,
  `ciudad_id` bigint(20) DEFAULT NULL,
  `metodo_pago_id` bigint(20) DEFAULT NULL
) ;

--
-- Volcado de datos para la tabla `pedidos`
--

INSERT INTO `pedidos` (`id_pedido`, `usuario_id`, `fecha_pedido`, `total`, `estado`, `pais`, `ciudad`, `direccion`, `codigo_postal`, `pais_id`, `ciudad_id`, `metodo_pago_id`) VALUES
(1, 3, '2026-09-12 20:30:47', 457000.00, 'entregado', 'Brasil', 'São Paulo', 'Calle 78 sur', '0258ed', 3, 7, 3),
(2, 5, '2026-09-15 07:53:12', 231997.00, 'pendiente', 'Colombia', 'Bogotá', 'lkjhgfd', '10100101', 5, 13, 3),
(3, 6, '2026-09-15 09:18:35', 627000.00, 'entregado', 'Chile', 'Santiago', 'calle 22 sur', '12300', 4, 10, 3),
(4, 6, '2026-09-15 19:14:22', 732000.00, 'pendiente', 'Perú', 'Arequipa', 'iuhyiugiu', 'yugtyug754', 8, 26, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id_producto` bigint(20) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `descripcion_corta` varchar(255) DEFAULT NULL,
  `precio` decimal(10,2) NOT NULL,
  `stock_total` int(11) NOT NULL DEFAULT 0,
  `imagen` varchar(500) DEFAULT NULL,
  `categoria_id` bigint(20) NOT NULL,
  `tallas` text DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1
) ;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id_producto`, `nombre`, `descripcion`, `descripcion_corta`, `precio`, `stock_total`, `imagen`, `categoria_id`, `tallas`, `activo`) VALUES
(1, 'Cuero Clásica', 'Chaqueta premium de cuero genuino con acabados refinados', 'Estilo premium para uso diario y eventos', 180000.00, 73, '/api/productos/imagenes/daa70384-61f7-4a38-b4c2-263a236fd548.webp', 1, '[{\"talla\":\"S\",\"cantidad\":42},{\"talla\":\"M\",\"cantidad\":9},{\"talla\":\"L\",\"cantidad\":4},{\"talla\":\"XL\",\"cantidad\":18}]', 0),
(2, 'Impermeable Storm Pro', 'Chaqueta resistente al agua con diseño funcional y moderno', 'Ideal para lluvia y clima cambiante', 219997.00, 15, '/api/productos/imagenes/ea45eaaf-6a66-47b2-be3e-1fb239bcce0f.png', 2, '[{\"talla\":\"S\",\"cantidad\":2},{\"talla\":\"M\",\"cantidad\":5},{\"talla\":\"L\",\"cantidad\":4},{\"talla\":\"XL\",\"cantidad\":4}]', 1),
(3, 'Acolchonada Nova', 'Chaqueta acolchada para máximo abrigo sin perder estilo', 'Calidez y confort para días fríos', 265000.00, 13, '/api/productos/imagenes/11053bd9-3577-4758-bdbb-ca654323736f.webp', 3, '[{\"talla\":\"S\",\"cantidad\":3},{\"talla\":\"M\",\"cantidad\":3},{\"talla\":\"L\",\"cantidad\":4},{\"talla\":\"XL\",\"cantidad\":3}]', 1),
(4, 'Deportiva Run', 'Chaqueta deportiva ligera, cómoda y versátil', 'Perfecta para actividades y uso casual', 199000.00, 20, '/api/productos/imagenes/b8108611-d530-46f9-8e5f-4e586e692c6d.webp', 4, '[{\"talla\":\"S\",\"cantidad\":5},{\"talla\":\"M\",\"cantidad\":7},{\"talla\":\"L\",\"cantidad\":5},{\"talla\":\"XL\",\"cantidad\":3}]', 1),
(5, 'Denim Urban', 'Chaqueta tipo denim con estilo casual e industrial', 'Un clásico renovado para cada outfit', 219000.00, 17, '/api/productos/imagenes/b14a1df3-958a-4f31-b237-95e4d1fbe051.webp', 5, '[{\"talla\":\"S\",\"cantidad\":4},{\"talla\":\"M\",\"cantidad\":5},{\"talla\":\"L\",\"cantidad\":4},{\"talla\":\"XL\",\"cantidad\":4}]', 1),
(6, 'Cuero Urbana', 'Chaqueta de cuero con diseño urbano, cómoda y versátil para uso diario.', 'Estilo moderno para el día a día.', 240000.00, 38, '/api/productos/imagenes/ba4e1492-d1a8-415a-a700-caa658154c2b.webp', 1, '[{\"talla\":\"XS\",\"cantidad\":5},{\"talla\":\"S\",\"cantidad\":20},{\"talla\":\"M\",\"cantidad\":10},{\"talla\":\"L\",\"cantidad\":1},{\"talla\":\"XL\",\"cantidad\":2}]', 1),
(7, 'Cuero Biker', 'Chaqueta de cuero resistente con diseño inspirado en el estilo motociclista.', 'Estilo rebelde con máxima personalidad.', 180000.00, 41, '/api/productos/imagenes/3baa8db1-afa6-4b4b-b280-b203f0690980.webp', 1, '[{\"talla\":\"XL\",\"cantidad\":25},{\"talla\":\"M\",\"cantidad\":10},{\"talla\":\"L\",\"cantidad\":6}]', 1),
(8, 'Cuero Casual', 'Chaqueta de cuero casual diseñada para combinar fácilmente con diferentes estilos.', 'Comodidad y estilo en una sola prenda.', 190000.00, 17, '/api/productos/imagenes/543d5301-7818-4143-9bc4-b15dce562f06.jpg', 1, '[{\"talla\":\"M\",\"cantidad\":4},{\"talla\":\"L\",\"cantidad\":10},{\"talla\":\"XL\",\"cantidad\":3}]', 1),
(9, 'Impermeable Light', 'Chaqueta impermeable de diseño ligero, perfecta para llevar durante el día.', 'Ligera, práctica y fácil de llevar.', 80000.00, 42, '/api/productos/imagenes/4402c4fc-3782-4e2b-bb97-e9ee776b177f.webp', 2, '[{\"talla\":\"L\",\"cantidad\":10},{\"talla\":\"M\",\"cantidad\":25},{\"talla\":\"XL\",\"cantidad\":7}]', 1),
(10, 'Impermeable Urban', 'Chaqueta impermeable con estilo moderno, ideal para desplazamientos en la ciudad.', 'Diseño urbano para días de lluvia.', 99995.00, 53, '/api/productos/imagenes/f910bd42-c932-4500-8ea0-207d30000faa.webp', 2, '[{\"talla\":\"S\",\"cantidad\":12},{\"talla\":\"M\",\"cantidad\":25},{\"talla\":\"L\",\"cantidad\":14},{\"talla\":\"XL\",\"cantidad\":2}]', 1),
(11, 'Impermeable Pro', 'Chaqueta impermeable de alta protección contra lluvia, viento y humedad.', 'Mayor protección para climas extremos.', 230000.00, 53, '/api/productos/imagenes/f2e05d48-0fc9-470b-b400-9bec05bb8612.webp', 2, '[{\"talla\":\"S\",\"cantidad\":18},{\"talla\":\"M\",\"cantidad\":14},{\"talla\":\"L\",\"cantidad\":17},{\"talla\":\"XL\",\"cantidad\":4}]', 1),
(12, 'Acolchada Comfort', 'Chaqueta acolchada ligera y cómoda, ideal para protegerse del frío.', ' Suavidad y comodidad durante todo el día.', 249998.00, 56, '/api/productos/imagenes/d0271553-2de1-4c62-b675-5ec33e4ec385.webp', 3, '[{\"talla\":\"XS\",\"cantidad\":12},{\"talla\":\"S\",\"cantidad\":15},{\"talla\":\"M\",\"cantidad\":12},{\"talla\":\"L\",\"cantidad\":17}]', 1),
(13, 'Acolchada Polar', 'Chaqueta acolchada diseñada para conservar el calor y brindar mayor comodidad.', 'Máxima protección para el clima frío.', 300000.00, 45, '/api/productos/imagenes/59744210-686b-407c-9486-0e8ac93a5cbe.jpg', 3, '[{\"talla\":\"S\",\"cantidad\":5},{\"talla\":\"M\",\"cantidad\":10},{\"talla\":\"L\",\"cantidad\":14},{\"talla\":\"XL\",\"cantidad\":16}]', 1),
(14, 'Acolchada Classic', 'Chaqueta acolchada de estilo tradicional, ideal para mantener una temperatura agradable.', 'Diseño clásico con excelente abrigo.', 210000.00, 35, '/api/productos/imagenes/94a67416-f9aa-4c7a-ac52-dc7d8a2a2256.jpg', 3, '[{\"talla\":\"M\",\"cantidad\":21},{\"talla\":\"L\",\"cantidad\":14},{\"talla\":\"XL\",\"cantidad\":0}]', 1),
(15, 'Deportiva Sport', 'Chaqueta deportiva de diseño moderno, pensada para brindar comodidad durante el ejercicio.', 'Diseño deportivo para cualquier entrenamiento.', 120000.00, 25, '/api/productos/imagenes/0b78bd27-8fb0-42e4-ad40-86c7cd5ebe68.webp', 4, '[{\"talla\":\"XS\",\"cantidad\":10},{\"talla\":\"S\",\"cantidad\":6},{\"talla\":\"M\",\"cantidad\":8},{\"talla\":\"L\",\"cantidad\":1}]', 1),
(16, 'Deportiva Training', 'Chaqueta deportiva cómoda y flexible, perfecta para diferentes rutinas de entrenamiento.', 'Ideal para entrenamientos diarios.', 99000.00, 57, '/api/productos/imagenes/6b761c75-29db-4336-8ad2-9fad72eeb6c2.jpg', 4, '[{\"talla\":\"XS\",\"cantidad\":30},{\"talla\":\"S\",\"cantidad\":12},{\"talla\":\"M\",\"cantidad\":12},{\"talla\":\"L\",\"cantidad\":3}]', 1),
(17, 'Deportiva Flex', 'Chaqueta flexible y ligera que permite moverse cómodamente durante el ejercicio.', 'Libertad de movimiento en cada actividad.', 120000.00, 36, '/api/productos/imagenes/73c58803-be51-48df-8eb2-9965a695b0e4.png', 4, '[{\"talla\":\"S\",\"cantidad\":20},{\"talla\":\"M\",\"cantidad\":6},{\"talla\":\"L\",\"cantidad\":10}]', 1),
(18, 'Denim Black', 'Chaqueta de denim negra con diseño moderno, perfecta para diferentes combinaciones.', 'Elegancia casual en color negro.', 180000.00, 33, '/api/productos/imagenes/7e3ac670-b73f-4ef8-8eae-b5274fa731ae.webp', 5, '[{\"talla\":\"M\",\"cantidad\":12},{\"talla\":\"L\",\"cantidad\":21}]', 1),
(19, 'Denim Vintage', 'Chaqueta de denim inspirada en estilos clásicos, con un acabado casual y vintage.', 'Un estilo retro con mucha personalidad.', 350000.00, 49, '/api/productos/imagenes/8c71f33f-b5af-484c-a84d-5602c2b8b708.webp', 5, '[{\"talla\":\"S\",\"cantidad\":25},{\"talla\":\"M\",\"cantidad\":10},{\"talla\":\"L\",\"cantidad\":14}]', 1),
(20, 'chaqueta overside', '', 'chaqueta demin', 123000.00, 4, '/api/productos/imagenes/97df3681-1661-44bc-af17-cc3f9510ca02.png', 5, '[{\"talla\":\"s\",\"cantidad\":1},{\"talla\":\"m\",\"cantidad\":3}]', 1),
(21, 'chaqueta pe', 'chaqueta linda', 'chaqueta pequeña', 120000.00, 34, '/api/productos/imagenes/6da1050a-543a-4742-8659-69054f46d479.jpg', 2, '[{\"talla\":\"L\",\"cantidad\":4},{\"talla\":\"S\",\"cantidad\":7},{\"talla\":\"XL\",\"cantidad\":11},{\"talla\":\"XS\",\"cantidad\":12}]', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto_tallas`
--

CREATE TABLE `producto_tallas` (
  `producto_id` bigint(20) NOT NULL,
  `talla_id` bigint(20) NOT NULL,
  `cantidad` int(11) NOT NULL DEFAULT 0
) ;

--
-- Volcado de datos para la tabla `producto_tallas`
--

INSERT INTO `producto_tallas` (`producto_id`, `talla_id`, `cantidad`) VALUES
(1, 2, 42),
(1, 3, 9),
(1, 4, 4),
(1, 5, 18),
(2, 2, 2),
(2, 3, 5),
(2, 4, 4),
(2, 5, 4),
(3, 2, 3),
(3, 3, 3),
(3, 4, 4),
(3, 5, 3),
(4, 2, 5),
(4, 3, 7),
(4, 4, 5),
(4, 5, 3),
(5, 2, 4),
(5, 3, 5),
(5, 4, 4),
(5, 5, 4),
(6, 1, 5),
(6, 2, 20),
(6, 3, 10),
(6, 4, 1),
(6, 5, 2),
(7, 3, 10),
(7, 4, 6),
(7, 5, 25),
(8, 3, 4),
(8, 4, 10),
(8, 5, 3),
(9, 3, 25),
(9, 4, 10),
(9, 5, 7),
(10, 2, 12),
(10, 3, 25),
(10, 4, 14),
(10, 5, 2),
(11, 2, 18),
(11, 3, 14),
(11, 4, 17),
(11, 5, 4),
(12, 1, 12),
(12, 2, 15),
(12, 3, 12),
(12, 4, 17),
(13, 2, 5),
(13, 3, 10),
(13, 4, 14),
(13, 5, 16),
(14, 3, 21),
(14, 4, 14),
(14, 5, 0),
(15, 1, 10),
(15, 2, 6),
(15, 3, 8),
(15, 4, 1),
(16, 1, 30),
(16, 2, 12),
(16, 3, 12),
(16, 4, 3),
(17, 2, 20),
(17, 3, 6),
(17, 4, 10),
(18, 3, 12),
(18, 4, 21),
(19, 2, 25),
(19, 3, 10),
(19, 4, 14),
(20, 2, 1),
(20, 3, 3),
(21, 1, 12),
(21, 2, 7),
(21, 4, 4),
(21, 5, 11);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id_rol` bigint(20) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id_rol`, `nombre`) VALUES
(1, 'admin'),
(3, 'cliente'),
(2, 'empleado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tallas`
--

CREATE TABLE `tallas` (
  `id_talla` bigint(20) NOT NULL,
  `nombre` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tallas`
--

INSERT INTO `tallas` (`id_talla`, `nombre`) VALUES
(4, 'L'),
(3, 'M'),
(2, 'S'),
(6, 'Única'),
(5, 'XL'),
(1, 'XS');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_documentos`
--

CREATE TABLE `tipo_documentos` (
  `id_tipo` bigint(20) NOT NULL,
  `tipo` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tipo_documentos`
--

INSERT INTO `tipo_documentos` (`id_tipo`, `tipo`) VALUES
(1, 'Cédula de ciudadanía'),
(2, 'Cédula de extranjería'),
(3, 'Pasaporte');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` bigint(20) NOT NULL,
  `nombres` varchar(100) NOT NULL,
  `apellidos` varchar(100) NOT NULL,
  `nuip` varchar(15) NOT NULL,
  `email` varchar(150) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `fecha_registro` datetime NOT NULL DEFAULT current_timestamp(),
  `tipo_documento_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombres`, `apellidos`, `nuip`, `email`, `telefono`, `password`, `activo`, `fecha_registro`, `tipo_documento_id`) VALUES
(1, 'José', 'Bermudez', '1000000001', 'admin@gmail.com', '3000000000', 'Admin123', 1, '2026-09-12 19:49:51', 1),
(2, 'Maria', 'Gonzales', '1000000002', 'empleado@gmail.com', '3000000001', 'Empleado123', 1, '2026-09-12 19:49:51', 1),
(3, 'Cliente', 'Demo', '1000000003', 'cliente@creacionescamar.com', '3000000002', 'cliente123', 1, '2026-09-12 19:49:51', 1),
(4, 'carlos', 'Muñoz', '1013126258', 'juan@gmail.com', '32255897', '123456Aa', 1, '2026-09-12 20:45:34', 1),
(5, 'carlos', 'maria', '13432', 'assdfds@gmail.com', '1234567', '12345Aaa', 0, '2026-09-15 07:30:35', 1),
(6, 'melany', 'tejada', '101312255', 'melany@gmail.com', '3223341234', '123456Aa', 1, '2026-09-15 09:16:46', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario_roles`
--

CREATE TABLE `usuario_roles` (
  `usuario_id` bigint(20) NOT NULL,
  `rol_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `usuario_roles`
--

INSERT INTO `usuario_roles` (`usuario_id`, `rol_id`) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 3),
(5, 3),
(6, 3);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `carrito_items`
--
ALTER TABLE `carrito_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_carrito_usuario_producto_talla` (`usuario_id`,`producto_id`,`talla`),
  ADD KEY `idx_carrito_usuario` (`usuario_id`),
  ADD KEY `fk_carrito_producto` (`producto_id`);

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id_categoria`),
  ADD UNIQUE KEY `uq_categorias_tipo` (`tipo_categoria`),
  ADD KEY `idx_categorias_activo` (`activo`);

--
-- Indices de la tabla `ciudades`
--
ALTER TABLE `ciudades`
  ADD PRIMARY KEY (`id_ciudad`),
  ADD UNIQUE KEY `uq_ciudades_pais_nombre` (`pais_id`,`nombre`);

--
-- Indices de la tabla `detalle_pedidos`
--
ALTER TABLE `detalle_pedidos`
  ADD PRIMARY KEY (`id_detalle`),
  ADD KEY `idx_detalle_pedido` (`pedido_id`),
  ADD KEY `idx_detalle_producto_talla` (`producto_id`,`talla`);

--
-- Indices de la tabla `metodos_pago`
--
ALTER TABLE `metodos_pago`
  ADD PRIMARY KEY (`id_metodo_pago`),
  ADD UNIQUE KEY `uq_metodos_pago_nombre` (`nombre`);

--
-- Indices de la tabla `monedas`
--
ALTER TABLE `monedas`
  ADD PRIMARY KEY (`id_moneda`),
  ADD UNIQUE KEY `uq_monedas_codigo` (`codigo`);

--
-- Indices de la tabla `paises`
--
ALTER TABLE `paises`
  ADD PRIMARY KEY (`id_pais`),
  ADD UNIQUE KEY `uq_paises_nombre` (`nombre`),
  ADD KEY `fk_paises_moneda` (`moneda_id`);

--
-- Indices de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`id_pedido`),
  ADD KEY `idx_pedidos_usuario` (`usuario_id`),
  ADD KEY `idx_pedidos_estado` (`estado`),
  ADD KEY `idx_pedidos_fecha` (`fecha_pedido`),
  ADD KEY `idx_pedidos_pais` (`pais_id`),
  ADD KEY `idx_pedidos_ciudad` (`ciudad_id`),
  ADD KEY `idx_pedidos_metodo_pago` (`metodo_pago_id`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id_producto`),
  ADD KEY `idx_productos_categoria` (`categoria_id`),
  ADD KEY `idx_productos_activo` (`activo`);

--
-- Indices de la tabla `producto_tallas`
--
ALTER TABLE `producto_tallas`
  ADD PRIMARY KEY (`producto_id`,`talla_id`),
  ADD KEY `idx_producto_tallas_talla` (`talla_id`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id_rol`),
  ADD UNIQUE KEY `uq_roles_nombre` (`nombre`);

--
-- Indices de la tabla `tallas`
--
ALTER TABLE `tallas`
  ADD PRIMARY KEY (`id_talla`),
  ADD UNIQUE KEY `uq_tallas_nombre` (`nombre`);

--
-- Indices de la tabla `tipo_documentos`
--
ALTER TABLE `tipo_documentos`
  ADD PRIMARY KEY (`id_tipo`),
  ADD UNIQUE KEY `uq_tipo_documentos_tipo` (`tipo`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `uq_usuarios_nuip` (`nuip`),
  ADD UNIQUE KEY `uq_usuarios_email` (`email`),
  ADD KEY `idx_usuarios_activo` (`activo`),
  ADD KEY `idx_usuarios_tipo_documento` (`tipo_documento_id`);

--
-- Indices de la tabla `usuario_roles`
--
ALTER TABLE `usuario_roles`
  ADD PRIMARY KEY (`usuario_id`,`rol_id`),
  ADD KEY `fk_usuario_roles_rol` (`rol_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `carrito_items`
--
ALTER TABLE `carrito_items`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id_categoria` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `ciudades`
--
ALTER TABLE `ciudades`
  MODIFY `id_ciudad` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT de la tabla `detalle_pedidos`
--
ALTER TABLE `detalle_pedidos`
  MODIFY `id_detalle` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `metodos_pago`
--
ALTER TABLE `metodos_pago`
  MODIFY `id_metodo_pago` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `monedas`
--
ALTER TABLE `monedas`
  MODIFY `id_moneda` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `paises`
--
ALTER TABLE `paises`
  MODIFY `id_pais` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `id_pedido` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id_producto` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id_rol` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `tallas`
--
ALTER TABLE `tallas`
  MODIFY `id_talla` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `tipo_documentos`
--
ALTER TABLE `tipo_documentos`
  MODIFY `id_tipo` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `carrito_items`
--
ALTER TABLE `carrito_items`
  ADD CONSTRAINT `fk_carrito_producto` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id_producto`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_carrito_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `ciudades`
--
ALTER TABLE `ciudades`
  ADD CONSTRAINT `fk_ciudades_pais` FOREIGN KEY (`pais_id`) REFERENCES `paises` (`id_pais`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `detalle_pedidos`
--
ALTER TABLE `detalle_pedidos`
  ADD CONSTRAINT `fk_detalle_pedido` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id_pedido`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_detalle_producto` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id_producto`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `paises`
--
ALTER TABLE `paises`
  ADD CONSTRAINT `fk_paises_moneda` FOREIGN KEY (`moneda_id`) REFERENCES `monedas` (`id_moneda`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD CONSTRAINT `fk_pedidos_ciudad` FOREIGN KEY (`ciudad_id`) REFERENCES `ciudades` (`id_ciudad`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_pedidos_metodo_pago` FOREIGN KEY (`metodo_pago_id`) REFERENCES `metodos_pago` (`id_metodo_pago`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_pedidos_pais` FOREIGN KEY (`pais_id`) REFERENCES `paises` (`id_pais`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_pedidos_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id_usuario`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `fk_productos_categoria` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id_categoria`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `producto_tallas`
--
ALTER TABLE `producto_tallas`
  ADD CONSTRAINT `fk_producto_tallas_producto` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id_producto`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_producto_tallas_talla` FOREIGN KEY (`talla_id`) REFERENCES `tallas` (`id_talla`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `fk_usuarios_tipo_documento` FOREIGN KEY (`tipo_documento_id`) REFERENCES `tipo_documentos` (`id_tipo`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `usuario_roles`
--
ALTER TABLE `usuario_roles`
  ADD CONSTRAINT `fk_usuario_roles_rol` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`id_rol`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_usuario_roles_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
