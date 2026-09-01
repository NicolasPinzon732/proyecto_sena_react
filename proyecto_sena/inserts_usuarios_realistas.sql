-- =====================================================
-- Inserción realista de usuarios para la base de datos
-- Ejecuta este script sobre la base mydb
-- =====================================================

USE mydb;

-- Roles
INSERT INTO Roles (id_rol, tipo_rol) VALUES
  (1, 'Admin'),
  (2, 'Empleado'),
  (3, 'Cliente')
ON DUPLICATE KEY UPDATE tipo_rol = VALUES(tipo_rol);

-- Usuarios reales con datos coherentes para la tienda
-- Nota: si tu backend usa bcrypt para login, cambia las contraseñas por hashes bcrypt reales.
INSERT INTO usuarios (id_usuario, p_nombre_usuario, s_nombre_usuario, p_ape_usuario, s_ape_usuario, telefono, contraseña, correo) VALUES
  (1, 'Camila', 'Andrea', 'Tobón', 'Gómez', '3204589012', 'Cami2025!', 'camila.tobon@creacionescamar.com'),
  (2, 'Mateo', 'Andrés', 'Ríos', 'Castro', '3156784321', 'Mateo2025!', 'mateo.rios@creacionescamar.com'),
  (3, 'Valentina', 'Sofía', 'Pérez', 'Mendoza', '3109876543', 'Vale2025!', 'valentina.perez@creacionescamar.com'),
  (4, 'Daniel', 'Esteban', 'Cárdenas', 'Lozano', '3004567890', 'Daniel2025!', 'daniel.cardenas@creacionescamar.com'),
  (5, 'Laura', 'Isabel', 'Muñoz', 'Ramírez', '3012345678', 'Laura2025!', 'laura.munoz@creacionescamar.com'),
  (6, 'Santiago', 'José', 'López', 'Prieto', '3227654321', 'Santi2025!', 'santiago.lopez@creacionescamar.com'),
  (7, 'María', 'José', 'Ortiz', 'Bedoya', '3149988776', 'Maria2025!', 'maria.ortiz@creacionescamar.com'),
  (8, 'Nicolás', 'Alejandro', 'García', 'Suárez', '3184412233', 'Nicolas2025!', 'nicolas.garcia@creacionescamar.com'),
  (9, 'Andrea', 'Paola', 'Vargas', 'Hernández', '3115566778', 'Andrea2025!', 'andrea.vargas@creacionescamar.com'),
  (10, 'Miguel', 'Ángel', 'Torres', 'Palacio', '3176655443', 'Miguel2025!', 'miguel.torres@creacionescamar.com'),
  (11, 'Ana', 'Lucía', 'Jiménez', 'Rincón', '3232219988', 'Ana2025!', 'ana.jimenez@creacionescamar.com'),
  (12, 'Julián', 'David', 'Mora', 'Quintero', '3196677889', 'Julian2025!', 'julian.mora@creacionescamar.com')
ON DUPLICATE KEY UPDATE
  p_nombre_usuario = VALUES(p_nombre_usuario),
  s_nombre_usuario = VALUES(s_nombre_usuario),
  p_ape_usuario = VALUES(p_ape_usuario),
  s_ape_usuario = VALUES(s_ape_usuario),
  telefono = VALUES(telefono),
  contraseña = VALUES(contraseña),
  correo = VALUES(correo);

-- Clientes reales
INSERT INTO cliente (usuarios_id_usuario) VALUES
  (1), (2), (3), (4), (5), (6), (7), (8), (9), (10), (11), (12)
ON DUPLICATE KEY UPDATE usuarios_id_usuario = VALUES(usuarios_id_usuario);

-- Relación usuarios-roles
INSERT INTO usuarios_has_Roles (usuarios_id_usuario, Roles_id_rol) VALUES
  (1, 3),
  (2, 3),
  (3, 3),
  (4, 3),
  (5, 3),
  (6, 3),
  (7, 3),
  (8, 3),
  (9, 3),
  (10, 3),
  (11, 3),
  (12, 3)
ON DUPLICATE KEY UPDATE Roles_id_rol = VALUES(Roles_id_rol);

-- Si quieres crear usuarios administrativos también, descomenta esto:
-- INSERT INTO usuarios (id_usuario, p_nombre_usuario, s_nombre_usuario, p_ape_usuario, s_ape_usuario, telefono, contraseña, correo) VALUES
--   (13, 'Admin', 'Sistema', 'Camar', 'S.A.S', '3001112233', 'Admin2025!', 'admin@creacionescamar.com'),
--   (14, 'Empleado', 'Principal', 'García', 'López', '3002223344', 'Empleado2025!', 'empleado@creacionescamar.com');
--
-- INSERT INTO usuarios_has_Roles (usuarios_id_usuario, Roles_id_rol) VALUES
--   (13, 1),
--   (14, 2);

SELECT 'Usuarios insertados correctamente' AS estado;
