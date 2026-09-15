# Rotisería Web

Para levantar el servidor hay que correr `node index.js`. Por defecto queda escuchando en el puerto 3000.

El proyecto está organizado en carpetas: `routes/` tiene las rutas de cada sección (usuarios, productos, ventas), y `utils/` tiene las funciones que se encargan de leer y guardar los datos en los archivos JSON de `data/`.

## Usuarios (/usuarios)
- GET /usuarios → devuelve la lista completa de usuarios (sin mostrar la contraseña).
- GET /usuarios/:id → devuelve un usuario puntual según su id.
- POST /usuarios/login → recibe email y contraseña en el body, y devuelve un mensaje de bienvenida si coinciden con algún usuario registrado.
- DELETE /usuarios/:id → elimina un usuario. Antes de borrarlo, también elimina todas las ventas que tenga asociadas, para que no queden ventas "sueltas" apuntando a un usuario que ya no existe.

## Productos (/productos)
- GET /productos → devuelve todos los productos disponibles.
- GET /productos/:id → devuelve un producto puntual.
- PUT /productos/:id → permite actualizar datos de un producto (por ejemplo, el precio), mandando en el body solo los campos que se quieren cambiar.
- DELETE /productos/:id → elimina un producto.

## Ventas (/ventas)
- GET /ventas → devuelve todas las ventas registradas.
- GET /ventas/:id → devuelve una venta puntual.
- POST /ventas → crea una venta nueva, mandando en el body los datos completos (usuario, productos, dirección, total, etc.).

## Ejemplo de body para probar el login
En Postman: método POST, pestaña Body → raw → JSON, y pegar:
{
    "email": "juan.perez@email.com",
    "contraseña": "123456"
}

## Ejemplo de body para crear una venta

{
    "id": 6,
    "id_usuario": 1,
    "fecha": "2026-09-15",
    "direccion": "Av. Ejemplo 123",
    "delivery": true,
    "productos": [
        { "id_producto": 1, "cantidad": 1, "subtotal": 9500 }
    ],
    "total": 9500
}

Todas las rutas se probaron con Postman