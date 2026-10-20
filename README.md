# Rotisería Web

El proyecto permite consultar un catálogo de productos, filtrarlos por categoría, administrar un carrito de compras y registrar pedidos.
Para esta entrega se continúa el proyecto desarrollado anteriormente, incorporando nuevas funcionalidades en el frontend y mejoras en la comunicación con el backend.
El servidor se inicia mediante el archivo index.js. --> "node index.js"

## Funcionalidades implementadas

1. Catálogo de productos
Se incorporó una nueva página Productos, accesible desde el navbar, donde se muestra el catálogo completo y se pueden filtrar los productos por categoría.

Acceso local: http://localhost:3000/pages/productos.html

Para acceder, el servidor debe estar iniciado.
2. Carrito de compras
- Permite agregar productos y seleccionar cantidades.
- Conserva los productos seleccionados mediante localStorage.
- Permite consultar el contenido del carrito y el total de la compra.

3. Inicio de sesión
Se utiliza sessionStorage para conservar los datos del usuario durante la sesión. Si se intenta agregar un producto sin haber iniciado sesión, este se guarda temporalmente y se incorpora al carrito después de iniciar sesión correctamente.

4. Compra y registro de pedidos
Se implementó la funcionalidad de compra, que interactúa con el backend para generar una orden de compra asociada al usuario y a los productos seleccionados.

Al confirmar el pedido, el frontend envía los datos mediante una solicitud HTTP POST. El backend valida la información, verifica la disponibilidad de los productos y las cantidades, calcula el total y registra la venta en el archivo JSON correspondiente.

5. Gestión de productos y ventas
El backend permite consultar productos y ventas, obtener registros por identificador, actualizar y eliminar productos, y registrar pedidos.

Las consultas de productos leen los datos actualizados desde el archivo JSON, evitando que la información quede desactualizada en memoria.

## Tecnologías y organización del proyecto

Se utilizan HTML, CSS, JavaScript, Node.js y Express. La comunicación entre frontend y backend se realiza mediante fetch y solicitudes HTTP. Los datos se almacenan en archivos JSON, mientras que localStorage y sessionStorage permiten conservar información en el navegador.

El proyecto utiliza una estructura de monorepo:
- public/: contiene las páginas HTML, los archivos JavaScript, los estilos y los recursos del frontend
- routes/: rutas del backend para usuarios, productos y ventas
- utils/: funciones para consultar y modificar los datos
- data/: archivos JSON de usuarios, productos y ventas
- index.js: configuración e inicio del servidor Express

## Pruebas realizadas

Se realizaron pruebas funcionales desde la aplicación web y mediante Postman, verificando las consultas, la actualización y eliminación de productos, y el registro de pedidos. También se comprobó la validación de los productos y el almacenamiento de las ventas.