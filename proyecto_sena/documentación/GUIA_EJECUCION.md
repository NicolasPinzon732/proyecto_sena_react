# 🚀 Guía de Ejecución del Proyecto Creaciones Camar

**Estado:** Listo para ejecutar desde cero  
**Fecha:** 31 de Agosto de 2026

---

## 📋 REQUISITOS PREVIOS

Antes de comenzar, asegúrate de tener instalado:

- ✅ **Java 17 o superior** → [Descargar](https://www.oracle.com/java/technologies/downloads/#java17)
- ✅ **Maven 3.8+** → [Descargar](https://maven.apache.org/download.cgi)
- ✅ **Node.js 18+** → [Descargar](https://nodejs.org/)
- ✅ **MySQL / XAMPP** → Opción A: [MySQL](https://www.mysql.com/downloads/) | Opción B: [XAMPP](https://www.apachefriends.org/) ⭐ **RECOMENDADO**
- ✅ **Git** (opcional pero recomendado)

### 💡 ¿Qué es XAMPP?
XAMPP es un paquete que incluye **Apache, MySQL, PHP y Perl** preconfigurados. Es la opción más fácil para desarrollo local.

### Verificar instalación (PowerShell)
```powershell
java -version
mvn -version
node -v
npm -v
mysql --version
```

---

## 🗄️ PASO 1: Configurar Base de Datos

### 1.1 Crear la Base de Datos

**Opción A: Usando XAMPP** ⭐ **MÁS FÁCIL**

1. Abre XAMPP Control Panel
2. Click en `Start` para **Apache** (opcional, solo si necesitas)
3. Click en `Start` para **MySQL**
   - Debería mostrar "Port 3306" en verde
4. Click en `Admin` en la fila de MySQL
   - Se abrirá phpMyAdmin en `http://localhost/phpmyadmin`
5. En phpMyAdmin:
   - Click en `SQL` (pestaña superior)
   - Copia y pega el contenido de `script_database`
   - Click en `Go` (botón azul abajo)
   - ✅ Base de datos creada

**Opción B: Usando MySQL Command Line**

```bash
# Abre el terminal de MySQL
mysql -u root -p

# Ejecuta estos comandos
CREATE DATABASE mydb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE mydb;

# Importa el script_database
SOURCE c:/Users/Familia/Desktop/proyecto_sena/script_database;
```

**Opción C: Usando MySQL Workbench**

1. Abre MySQL Workbench
2. Ve a `File` → `Open SQL Script`
3. Selecciona el archivo: `script_database` (en la carpeta del proyecto)
4. Click en `Execute` (rayo)
5. Verifica que se creó la base de datos `mydb`

### 1.2 Verificar que las tablas se crearon

**Si usas XAMPP:**
- En phpMyAdmin, ve a la izquierda y selecciona la base de datos `mydb`
- Deberías ver todas las tablas

**Si usas MySQL directamente:**
```sql
USE mydb;
SHOW TABLES;
```

Deberías ver estas tablas:
- proveedor
- categoria
- Producto
- talla
- stock
- Empleado
- usuarios
- Roles
- cliente
- usuarios_has_Roles
- facturacion
- metodo_pago
- facturacion_has_metodo_pago
- Producto_has_facturacion_has_metodo_pago
- Envio
- ciudad
- Pais
- Direccion

---

## ⚙️ PASO 2: Configurar Spring Boot

### 2.1 Abrir el archivo de configuración

Ruta: `demo/src/main/resources/application.properties`

### 2.2 Agregar la configuración de la base de datos

**Si usas XAMPP, copia y pega esto:**

```properties
# Configuración de Servidor
spring.application.name=creaciones_camar_api
server.port=8080

# Configuración de Base de Datos (XAMPP)
spring.datasource.url=jdbc:mysql://localhost:3306/mydb
spring.datasource.username=root
spring.datasource.password=
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=true

# Logging
logging.level.root=INFO
logging.level.com.creaciones_camar.demo=DEBUG

# Configuración CORS (desarrollo)
spring.mvc.cors.allowed-origins=http://localhost:5173,http://localhost:3000
spring.mvc.cors.allowed-methods=*
spring.mvc.cors.allowed-headers=*
spring.mvc.cors.allow-credentials=true
```

**Si tu MySQL tiene contraseña, modifica esta línea:**
```properties
spring.datasource.password=TU_CONTRASEÑA_AQUI
```

### 2.3 Si usas XAMPP

✅ **Los valores por defecto funcionan perfectamente:**
- Usuario: `root`
- Contraseña: (vacío)
- Host: `localhost`
- Puerto: `3306`
- Base de datos: `mydb`

No necesitas cambiar nada si has creado la base de datos `mydb` en XAMPP.

### 2.4 Verificar que el archivo pom.xml esté completo

El archivo `demo/pom.xml` debe estar presente. Contiene todas las dependencias de Maven.

---

## 💻 PASO 3: Ejecutar Spring Boot

### 3.1 Abrir PowerShell en la carpeta del backend

```powershell
cd C:\Users\Familia\Desktop\proyecto_sena\demo
```

### 3.2 Compilar el proyecto (primera vez)

```powershell
mvn clean install
```

Este comando:
- Descarga todas las dependencias
- Compila el código
- Ejecuta los tests

**Tiempo esperado:** 2-5 minutos

### 3.3 Ejecutar el servidor Spring Boot

```powershell
mvn spring-boot:run
```

**Deberías ver algo como esto:**

```
[INFO] Spring Boot v3.1.1
[INFO] Starting DemoApplication
[INFO] Tomcat started on port(s): 8080 (http)
[INFO] Started DemoApplication in 3.5 seconds
```

✅ **El backend está listo en:** `http://localhost:8080`

---

## ⚛️ PASO 4: Ejecutar React

### 4.1 Abrir NUEVA PowerShell (sin cerrar la de Spring Boot)

```powershell
cd C:\Users\Familia\Desktop\proyecto_sena\creaciones_camar
```

### 4.2 Instalar dependencias (primera vez)

```powershell
npm install
```

Este comando:
- Instala todas las librerías de `package.json`
- Crea la carpeta `node_modules`

**Tiempo esperado:** 2-3 minutos

### 4.3 Ejecutar el servidor de desarrollo

```powershell
npm run dev
```

**Deberías ver algo como esto:**

```
  VITE v8.2.2  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

✅ **El frontend está listo en:** `http://localhost:5173`

---

## 🌐 PASO 5: Acceder a la Aplicación

### Abrir en el navegador

**Opción 1: Automáticamente**
- Al ejecutar `npm run dev`, se abrirá automáticamente

**Opción 2: Manual**
- Navega a: `http://localhost:5173`

### Verás la página de inicio

Si todo está correcto, deberías ver:
- Página de catálogo de productos
- Sistema de login
- Carrito de compras

---

## 🔑 PASO 6: Probar el Sistema

### 6.1 Crear un Usuario Administrador

```sql
INSERT INTO usuarios (p_nombre_usuario, s_nombre_usuario, p_ape_usuario, s_ape_usuario, telefono, contraseña, correo) 
VALUES ('Admin', 'Sistema', 'Creaciones', 'Camar', '3001234567', 'admin123', 'admin@creacionescamar.com');
```

### 6.2 Iniciar Sesión

1. Ve a `http://localhost:5173/login`
2. Email: `admin@creacionescamar.com`
3. Contraseña: `admin123`
4. Click en "Iniciar Sesión"

### 6.3 Crear Datos de Prueba

Una vez dentro del panel admin:
1. Crea categorías
2. Crea productos
3. Prueba el carrito como cliente
4. Crea un pedido

---

## 🧪 VERIFICACIÓN RÁPIDA

### Comprobar que todo funciona

**Backend (Terminal 1):**
```powershell
# Debería mostrar el servidor corriendo
mvn spring-boot:run
```

**Frontend (Terminal 2):**
```powershell
# Debería mostrar la URL local
npm run dev
```

**En el navegador:**
- ✅ Accede a `http://localhost:5173`
- ✅ Intenta ir a `/login`
- ✅ Intenta ir a `/cliente/catalogo`

---

## 🎯 GUÍA ESPECÍFICA PARA XAMPP

### Instalación de XAMPP

1. Descarga XAMPP: https://www.apachefriends.org/
2. Instala el paquete (Windows Installer)
3. Elige la carpeta de instalación (recomendado: `C:\xampp\`)
4. Completa la instalación

### Iniciar XAMPP (cada vez que trabajes)

1. Abre **XAMPP Control Panel** (busca en Inicio)
2. En la fila **MySQL**, click en `Start`
   - Espera a que diga "Port 3306" en verde
3. **Opcional:** Click en `Start` para Apache (solo si necesitas servidor web)

**La ventana se verá así:**
```
Apache       [Start] [Stop] [Admin]        Port 80
MySQL        [Start] [Stop] [Admin]        Port 3306
```

### Detener XAMPP (al terminar)

1. En la fila **MySQL**, click en `Stop`
2. En la fila **Apache**, click en `Stop` (si lo iniciaste)
3. Cierra XAMPP Control Panel

### Acceder a phpMyAdmin (interfaz web)

En el navegador, ve a: `http://localhost/phpmyadmin/`

Aquí puedes:
- ✅ Ver las bases de datos
- ✅ Ver las tablas
- ✅ Ejecutar consultas SQL
- ✅ Administrar usuarios

### Pasos para crear la BD en XAMPP

1. Abre phpMyAdmin: `http://localhost/phpmyadmin/`
2. Click en pestaña `SQL` (arriba)
3. Abre el archivo `script_database` con un editor de texto
4. Copia TODO el contenido
5. Pégalo en la ventana SQL de phpMyAdmin
6. Click en botón azul `Go` o presiona `Ctrl + Enter`
7. Debería mostrar: "✓ 18 queries executed" o similar
8. En la izquierda, deberías ver la base de datos `mydb`

---

## ⚠️ PROBLEMAS COMUNES Y SOLUCIONES

### Problema: "Connection refused en MySQL"

**Si usas XAMPP:**
```
1. Abre XAMPP Control Panel
2. Verifica que MySQL está corriendo (debe mostrar puerto 3306 en verde)
3. Si está en rojo, click en "Start"
4. Espera 5 segundos y vuelve a intentar
```

**Si usas MySQL instalado:**
```powershell
# Windows: Services → MySQL80 → Start
# Verifica las credenciales
spring.datasource.username=root
spring.datasource.password=
```

### Problema: "No puedo conectar a phpMyAdmin"

```
1. XAMPP Control Panel → MySQL debe estar iniciado (verde)
2. En navegador, ve a: http://localhost/phpmyadmin/
3. Si no funciona, intenta: http://127.0.0.1/phpmyadmin/
```

### Problema: "Puerto 3306 ya está en uso"

```
XAMPP usa por defecto el puerto 3306.
Si otro servicio lo usa:
1. Abre XAMPP Control Panel
2. Click en Config (MySQL)
3. En "MySQL" cambiar puerto a 3307
4. Actualizar application.properties:
   spring.datasource.url=jdbc:mysql://localhost:3307/mydb
```

### Problema: "Puerto 8080 ya está en uso"
```powershell
# Cambiar puerto en application.properties
server.port=8081
```

### Problema: "Puerto 5173 ya está en uso"
```powershell
# Cambiar puerto ejecutando
npm run dev -- --port 3000
```

### Problema: "npm command not found"
```powershell
# Node.js no está instalado
# Descarga de: https://nodejs.org/
```

### Problema: "mvn command not found"
```powershell
# Maven no está instalado
# Descarga de: https://maven.apache.org/
```

### Problema: "Módulo de materiales aún existe"
```
El proyecto se actualizó el 31 de agosto.
Verifica que estés usando la versión actualizada.
```

---

## 📝 ESTRUCTURA DE CARPETAS

```
proyecto_sena/
├── demo/                          # Backend Spring Boot
│   ├── src/main/
│   │   ├── java/                  # Código fuente
│   │   └── resources/
│   │       └── application.properties  # ⚙️ CONFIGURAR AQUÍ
│   ├── pom.xml                    # Dependencias Maven
│   └── mvnw                       # Maven wrapper
│
├── creaciones_camar/              # Frontend React
│   ├── src/                       # Código fuente
│   ├── package.json               # Dependencias npm
│   ├── vite.config.js             # Configuración Vite
│   └── node_modules/              # Se crea con npm install
│
├── script_database                # Script SQL para BD
├── GUIA_RAPIDA.md                 # Guía de URLs y usuarios
└── otros archivos...
```

---

## 🎯 COMANDOS RÁPIDOS

### Terminal 1 - Backend
```powershell
cd C:\Users\Familia\Desktop\proyecto_sena\demo
mvn clean install              # Primera instalación
mvn spring-boot:run            # Ejecutar servidor
```

### Terminal 2 - Frontend
```powershell
cd C:\Users\Familia\Desktop\proyecto_sena\creaciones_camar
npm install                    # Primera instalación
npm run dev                    # Ejecutar servidor
```

---

## ✅ CHECKLIST FINAL

- [ ] Java 17+ instalado
- [ ] Maven instalado
- [ ] Node.js instalado
- [ ] MySQL instalado y corriendo
- [ ] Base de datos `mydb` creada
- [ ] Archivo `application.properties` configurado
- [ ] Backend ejecutándose en `http://localhost:8080`
- [ ] Frontend ejecutándose en `http://localhost:5173`
- [ ] Navegador abierto en `http://localhost:5173`
- [ ] Acceso a `/login` sin errores
- [ ] Acceso a `/cliente/catalogo` sin errores

---

## 🚀 ¡LISTO!

Una vez que ambos servidores estén corriendo:

1. **Backend API:** `http://localhost:8080/api/**`
2. **Frontend Web:** `http://localhost:5173`
3. **Login:** `http://localhost:5173/login`
4. **Admin Panel:** `http://localhost:5173/admin` (requiere rol admin)

---

## 📞 AYUDA ADICIONAL

Si algo falla:

1. **Revisa los logs** en las terminales
2. **Verifica puertos** con `netstat -ano | findstr :8080`
3. **Reinicia MySQL** en Services
4. **Limpia cache** con `mvn clean` y `npm cache clean --force`
5. **Borra node_modules** y vuelve a instalar con `npm install`

---

**¡Estás listo para trabajar con el proyecto!** 🎉
