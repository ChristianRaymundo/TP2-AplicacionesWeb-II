# Rotisería Web

El proyecto permite consultar un catálogo de productos, filtrarlos por categoría, administrar un carrito de compras y registrar pedidos.


## Organizacion

El proyecto utiliza una estructura de tipo monorepo, ya que el frontend y el backend se encuentran dentro del mismo repositorio.

- public/: páginas, estilos, scripts e imágenes. Express lo sirve directamente.

- routes/: rutas del backend (usuarios, productos y ventas).

- utils/: funciones que consultan y modifican los datos.

- db/: conexión a MongoDB y schemas.

- middlewares/: verificación del token JWT.

- data/: archivos JSON con los datos iniciales.

- scripts/: carga de datos y generación de hashes de contraseñas.

- index.js: configuración e inicio del servidor.

Tecnologías: Node.js, Express, MongoDB con Mongoose, bcryptjs, jsonwebtoken, cors y dotenv. Las versiones de las dependencias se encuentran en el package.json.

## Como ejecutar el proyecto

Requisitos: Node.js y MongoDB en funcionamiento. La configuración inicial utiliza la base de datos rotiseria, con la siguiente dirección local:

mongodb://127.0.0.1:27017/rotiseria

1. Instalar dependencias: npm install

2. Crear el archivo .env en la raíz del proyecto y configurar las siguientes variables:
    PORT=3000
    JWT_SECRET=una_clave_secreta
    MONGO_URI=mongodb://127.0.0.1:27017/rotiseria

3. Preparar las contraseñas de los datos iniciales, si se encuentran en texto plano: node scripts/migrar-passwords.js
Si las contraseñas ya tienen su hash, no las procesa nuevamente.
En los datos iniciales del proyecto las contraseñas ya están hasheadas, por lo que este paso no es necesario normalmente. Se utiliza, por ejemplo, si se agrega manualmente un usuario al archivo JSON con una contraseña en texto plano.

4. Cargar los datos iniciales en MongoDB: node scripts/seed.js
    Este script vacía las colecciones y las carga de nuevo con los archivos JSON de `data/`, por lo que sirve para dejar la base como al principio.

5. Iniciar el servidor: node index.js

6. Abrir la aplicación en el navegador: http://localhost:3000
    Si el puerto 3000 está ocupado por otro proyecto, cambiar `PORT` en el `.env` y abrir la aplicación en ese puerto.

## Rutas

### Usuarios (/usuarios)

- GET /usuarios → devuelve la lista de usuarios sin mostrar sus contraseñas.

- GET /usuarios/:id → devuelve un usuario puntual.

- POST /usuarios → registra un usuario nuevo. Si el email ya existe, devuelve un error.

- POST /usuarios/login → recibe email y contraseña, verifica las credenciales y devuelve los datos del usuario y un token JWT.

- DELETE /usuarios/:id → no elimina al usuario, lo marca como inactivo mediante el campo activo: false, para conservar su relación con las ventas.

### Productos (/productos)

- GET /productos → devuelve todos los productos.

- GET /productos/:id → devuelve un producto puntual.

- POST /productos → crea un producto nuevo.

- PUT /productos/:id → actualiza los campos que se envíen en el body.

- DELETE /productos/:id → elimina un producto.

### Ventas (/ventas)

- GET /ventas → devuelve las ventas con los datos relacionados de los usuarios y productos.

- GET /ventas/:id → devuelve una venta puntual.

- POST /ventas → registra un pedido. Requiere un token JWT válido. El servidor valida los datos, calcula los subtotales y el total, suma $500 si el pedido es con delivery y obtiene el usuario a partir del token.

## Cómo probar la autenticación en Postman

Realizar un POST a /usuarios/login, enviando el correo electrónico y la contraseña de un usuario registrado. En Postman seleccionar Body → raw → JSON. Copiar el token recibido en la respuesta.

Ejemplo de body:

{
    "email": "lucas.rodriguez@email.com",
    "contraseña": "lucas456"
}

Realizar un POST a /ventas sin enviar el token. El servidor debe responder con el código 401, indicando que no se proporcionó un token.

Repetir la solicitud incluyendo el token en Authorization → Bearer Token y enviando los datos del pedido en el body. Si los datos son correctos, el servidor registra la venta y responde con el código 201.

Ejemplo de body:

{
    "telefono": "3511234567",
    "direccion": "Av. Ejemplo 123",
    "delivery": true,
    "formaPago": "Efectivo",
    "observaciones": "Sin cebolla",
    "productos": [
        { "id_producto": 1, "cantidad": 12 },
        { "id_producto": 12, "cantidad": 1, "extraJQ": true }
    ]
}

También se verificó el rechazo de credenciales incorrectas durante el inicio de sesión.

### Pruebas realizadas

Se realizaron pruebas desde el navegador y Postman para comprobar:

Consulta, creación, modificación y eliminación de productos.

Registro de usuarios e inicio de sesión.

Generación y verificación de hashes de contraseñas con Bcrypt.

Generación y validación de tokens JWT.

Rechazo de solicitudes de compra sin un token válido.

Registro y consulta de pedidos en MongoDB.