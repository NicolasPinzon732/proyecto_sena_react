# 🎯 GUÍA RÁPIDA: XAMPP + Proyecto Creaciones Camar

**Para usuarios que prefieren XAMPP en lugar de instalar MySQL por separado**

---

## ✅ ¿POR QUÉ USAR XAMPP?

- ✅ **Fácil instalación** - Todo viene preconfigurado
- ✅ **Sin configuración compleja** - Solo iniciar y usar
- ✅ **Interfaz gráfica** - phpMyAdmin para ver bases de datos
- ✅ **Perfecto para desarrollo** - Ideal para aprender y probar

---

## 📥 PASO 1: Instalar XAMPP

### 1.1 Descargar XAMPP

Ve a: https://www.apachefriends.org/

Elige la versión para Windows (recomendada: la más reciente)

### 1.2 Instalar

1. Ejecuta el instalador descargado
2. Click en `Next`
3. Selecciona la carpeta (default: `C:\xampp\`)
4. Click en `Next` hasta terminar
5. Elige "Yes" si te pregunta si quieres iniciar XAMPP ahora

---

## 🚀 PASO 2: Iniciar MySQL en XAMPP

Cada vez que quieras trabajar, haz esto:

### Abrir XAMPP Control Panel

1. Busca en Inicio: "XAMPP Control Panel"
2. Ábrelo
3. Verás una ventana como esta:

```
┌─────────────────────────────────────┐
│  Apache     [Start] [Stop] [Admin]  │
│  MySQL      [Start] [Stop] [Admin]  │
│  FileZilla  [Start] [Stop]          │
│  Tomcat     [Start] [Stop]          │
└─────────────────────────────────────┘
```

### Iniciar MySQL

1. En la línea de **MySQL**, click en botón **[Start]**
2. Espera a que aparezca el puerto:
   ```
   MySQL        [Stop] [Admin]        Port 3306
   ```
3. Cuando veas "Port 3306" en **VERDE**, MySQL está listo ✅

---

## 🗄️ PASO 3: Crear la Base de Datos

### Opción 1: Usando phpMyAdmin (MÁS FÁCIL)

1. En tu navegador, ve a: **`http://localhost/phpmyadmin/`**

2. Se abrirá una interfaz web (phpMyAdmin)

3. Busca en el menú superior la pestaña **`SQL`** y haz click

4. Abre el archivo `script_database` con Notepad o Visual Studio Code
   - Ruta: `C:\Users\Familia\Desktop\proyecto_sena\script_database`

5. Selecciona TODO el contenido (Ctrl + A)

6. Cópialo (Ctrl + C)

7. Vuelve a phpMyAdmin, en la caja de SQL que está vacía

8. Pega TODO el código (Ctrl + V)

9. Scroll hacia abajo y busca botón azul que dice **`Go`**

10. Click en **`Go`**

11. Espera a que aparezca el mensaje: **`✓ 18 queries executed successfully`**

12. ¡Base de datos creada! ✅

### Opción 2: Usando MySQL Command Line (si conoces SQL)

1. En XAMPP Control Panel, en la fila MySQL, click en **[Admin]**

2. Se abrirá una terminal

3. Copia y pega:
```sql
SOURCE C:/Users/Familia/Desktop/proyecto_sena/script_database;
```

4. Presiona Enter

---

## 🔧 PASO 4: Configurar Spring Boot

### Abre el archivo de configuración

Ruta: `C:\Users\Familia\Desktop\proyecto_sena\demo\src\main\resources\application.properties`

### Borra TODO el contenido y pega esto:

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

### ✅ ¡Listo! No necesitas cambiar nada más

XAMPP usa por defecto:
- Usuario: `root`
- Sin contraseña
- Puerto: `3306`

Estos valores ya están configurados arriba.

---

## 💻 PASO 5: Ejecutar el Proyecto

### Terminal 1 - Backend

```powershell
cd C:\Users\Familia\Desktop\proyecto_sena\demo

# Primera vez solamente:
mvn clean install

# Luego cada vez que trabajes:
mvn spring-boot:run
```

**Espera a ver:**
```
[INFO] Started DemoApplication in 3.5 seconds
```

✅ Backend listo en: `http://localhost:8080`

### Terminal 2 - Frontend (NUEVA terminal PowerShell)

```powershell
cd C:\Users\Familia\Desktop\proyecto_sena\creaciones_camar

# Primera vez solamente:
npm install

# Luego cada vez que trabajes:
npm run dev
```

**Espera a ver:**
```
➜ Local: http://localhost:5173/
```

✅ Frontend listo en: `http://localhost:5173`

---

## 🌐 PASO 6: Acceder a la Aplicación

En tu navegador, ve a: **`http://localhost:5173`**

Deberías ver:
- ✅ Página de inicio
- ✅ Sistema de login
- ✅ Catálogo de productos

---

## 🧪 Probar el Sistema

### Crear Usuario Admin (primera vez)

En phpMyAdmin (http://localhost/phpmyadmin/):

1. Click en pestaña **SQL**
2. Copia y pega:
```sql
INSERT INTO usuarios (p_nombre_usuario, p_ape_usuario, telefono, contraseña, correo) 
VALUES ('Admin', 'Sistema', '3001234567', 'admin123', 'admin@creacionescamar.com');
```
3. Click en **Go**

### Login

1. Ve a `http://localhost:5173/login`
2. Email: `admin@creacionescamar.com`
3. Contraseña: `admin123`
4. Click en "Iniciar Sesión"
5. ¡Deberías estar en el panel admin! 🎉

---

## 🛑 DETENER XAMPP (al terminar de trabajar)

1. En XAMPP Control Panel, fila MySQL
2. Click en **[Stop]**
3. Espera a que se ponga rojo
4. Cierra XAMPP Control Panel

---

## 🆘 PROBLEMAS COMUNES CON XAMPP

### "No puedo conectar a phpMyAdmin"

```
1. Abre XAMPP Control Panel
2. Verifica que MySQL esté INICIADO (verde)
3. Intenta estas URLs:
   - http://localhost/phpmyadmin/
   - http://127.0.0.1/phpmyadmin/
```

### "Connection refused en Spring Boot"

```
1. Abre XAMPP Control Panel
2. Verifica que MySQL está INICIADO (verde)
3. Si está rojo, click en [Start]
4. Espera 5 segundos
5. Vuelve a ejecutar: mvn spring-boot:run
```

### "Port 3306 already in use"

```
Otro programa usa MySQL. Opciones:
1. Cambiar puerto en XAMPP Config
2. Cerrar otro programa que use 3306
3. Reiniciar la computadora
```

### "No veo las tablas en phpMyAdmin"

```
1. Verifica que creaste la BD correctamente
2. En phpMyAdmin, left side, busca "mydb"
3. Si no existe, vuelve a ejecutar script_database
4. Verifica que no hubo errores al pegar el código SQL
```

---

## 📋 CHECKLIST FINAL

- [ ] XAMPP instalado
- [ ] MySQL iniciado en XAMPP (verde)
- [ ] Base de datos `mydb` creada
- [ ] Archivo `application.properties` configurado
- [ ] Backend ejecutándose (`http://localhost:8080`)
- [ ] Frontend ejecutándose (`http://localhost:5173`)
- [ ] Usuario admin creado
- [ ] Login funciona
- [ ] Panel admin accesible

---

## 🎯 RESUMEN DE COMANDOS XAMPP

**Iniciar XAMPP (cada trabajo):**
1. Busca "XAMPP Control Panel"
2. Click MySQL → [Start]
3. Espera verde

**Abrir phpMyAdmin:**
- `http://localhost/phpmyadmin/`

**Parar XAMPP (al terminar):**
1. XAMPP Control Panel
2. Click MySQL → [Stop]
3. Espera rojo

**Backend:**
```powershell
cd C:\Users\Familia\Desktop\proyecto_sena\demo
mvn spring-boot:run
```

**Frontend:**
```powershell
cd C:\Users\Familia\Desktop\proyecto_sena\creaciones_camar
npm run dev
```

---

## ✨ ¡YA ESTÁS LISTO!

Con XAMPP es realmente fácil. Solo recuerda:

1. **Iniciar:** XAMPP Control Panel → MySQL [Start]
2. **Trabajar:** Backend y Frontend en dos terminales
3. **Acceder:** `http://localhost:5173`
4. **Parar:** XAMPP Control Panel → MySQL [Stop]

**¡Diviértete codificando!** 🚀
