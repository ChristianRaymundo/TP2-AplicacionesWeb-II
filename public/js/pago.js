console.log("pago.js cargado");

// abrir modal al presionar "Finalizar compra"
document.getElementById("btn-finalizar").addEventListener("click", function () {
    document.getElementById("modal-pago").style.display = "flex";
});

// procesar formulario y registrar el pedido
document.getElementById("form-pago").addEventListener("submit", async function (e) {
    e.preventDefault();

    // obtener usuario de la sesión
    const usuario = JSON.parse(sessionStorage.getItem("usuario"));

    if (!usuario || !usuario.id) {
        alert("Debés iniciar sesión para realizar una compra.");
        window.location.href = "../login.html";
        return;
    }

    const telefono = document.getElementById("telefono").value.trim();
    const direccion = document.getElementById("direccion").value.trim();
    const observaciones = document.getElementById("observaciones").value.trim();

    const formaPago = document.querySelector('input[name="pago"]:checked').value;
    const tipoEntrega = document.querySelector('input[name="entrega"]:checked').value;

    // obtener carrito guardado
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    if (carrito.length === 0) {
        alert("El carrito está vacío.");
        return;
    }

    // detectar ruta
    const dentroDePages = window.location.pathname.includes("/pages/");
    const basePath = dentroDePages ? "../" : "";

    // abrir una pestaña vacía para evitar bloqueos del navegador
    const ventanaWhatsApp = window.open("about:blank", "_blank");

    try {
        // obtener los productos del backend
        const responseProductos = await fetch("/productos");

        if (!responseProductos.ok) {
            throw new Error("No se pudieron obtener los productos.");
        }

        const productos = await responseProductos.json();

        let productosTexto = "";
        let total = 0;
        const productosVenta = [];

        // calcular subtotales y preparar los productos para guardar
        for (const item of carrito) {
            const producto = productos.find(p => p.id === Number(item.id));

            if (!producto) {
                throw new Error("Uno de los productos del carrito ya no existe.");
            }

            let subtotal = 0;

            if (producto.categoria === "Empanadas") {
                const cantidad = Number(item.cantidad);
                const docenas = Math.floor(cantidad / 12);
                const resto = cantidad % 12;

                subtotal = docenas * 9500;

                if (resto === 6) {
                    subtotal += 5000;
                }
            } else {
                let precioUnitario = producto.precio;

                if (item.extraJQ) {
                    precioUnitario += 500;
                }

                subtotal = precioUnitario * item.cantidad;
            }

            total += subtotal;

            // datos que se guardarán en ventas.json
            productosVenta.push({
                id_producto: Number(item.id),
                cantidad: Number(item.cantidad),
                subtotal,
                ...(item.extraJQ ? { extraJQ: true } : {})
            });

            let nombreProducto = producto.titulo;

            if (item.extraJQ) {
                nombreProducto += " + Jamón y Queso";
            }

            productosTexto +=
                `• ${nombreProducto} x${item.cantidad} - $${subtotal.toLocaleString("es-AR")}\n`;
        }

        // calcular costo de entrega
        const delivery = tipoEntrega === "Delivery";
        const costoDelivery = delivery ? 500 : 0;
        total += costoDelivery;

        // preparar datos de la venta para el backend
        const nuevaVenta = {
            id_usuario: Number(usuario.id),
            telefono,
            direccion: delivery ? direccion : "",
            delivery,
            formaPago,
            observaciones,
            productos: productosVenta
        };

        // registrar la venta en el backend
        const responseVenta = await fetch("/ventas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(nuevaVenta)
        });

        const resultado = await responseVenta.json();

        if (!responseVenta.ok) {
            throw new Error(resultado.mensaje || "No se pudo registrar el pedido.");
        }

        // usar la venta registrada como referencia del pedido
        const numeroPedido = "PED-" + resultado.venta.id;

        // reemplazar por el número de WhatsApp correspondiente
        const numeroRotiseria = "5493518112819";

        let datosEntrega = "";

        if (delivery) {
            datosEntrega =
                `*Tipo de entrega:* Delivery\n*Dirección:* ${direccion}`;
        } else {
            datosEntrega = "*Tipo de entrega:* Retiro en el local";
        }

        const mensaje =
            `*NUEVO PEDIDO - ROTISERÍA LA COLONIA*

*REFERENCIA:* ${numeroPedido}

*Cliente:* ${usuario.nombre} ${usuario.apellido}
*Teléfono:* ${telefono}
${datosEntrega}

*PRODUCTOS:*
${productosTexto}
${delivery ? `*Costo de delivery:* $${costoDelivery.toLocaleString("es-AR")}\n` : ""}
*Total:* $${Number(resultado.venta.total).toLocaleString("es-AR")}

*Forma de pago:* ${formaPago}

*Observaciones:*
${observaciones || "Sin observaciones"}`;

        const url = `https://wa.me/${numeroRotiseria}?text=${encodeURIComponent(mensaje)}`;

        // abrir WhatsApp después de registrar correctamente la venta
        if (ventanaWhatsApp) {
            ventanaWhatsApp.location.href = url;
        } else {
            window.location.href = url;
        }

        // vaciar el carrito solo después de registrar la venta
        localStorage.removeItem("carrito");

        // cerrar modal
        cerrarModal();

        // redirigir a la página de confirmación
        setTimeout(() => {
            window.location.href = `${basePath}pages/gracias.html`;
        }, 1000);

    } catch (error) {
        console.error("Error al generar el pedido:", error);

        if (ventanaWhatsApp && !ventanaWhatsApp.closed) {
            ventanaWhatsApp.close();
        }

        alert(error.message || "Ocurrió un error al generar el pedido.");
    }
});

// mostrar u ocultar dirección según tipo de entrega
const radiosEntrega = document.querySelectorAll('input[name="entrega"]');
const campoDireccion = document.getElementById("campo-direccion");
const direccionInput = document.getElementById("direccion");

radiosEntrega.forEach(radio => {
    radio.addEventListener("change", function () {
        if (this.value === "Delivery") {
            campoDireccion.style.display = "block";
            direccionInput.required = true;
        } else {
            campoDireccion.style.display = "none";
            direccionInput.required = false;
            direccionInput.value = "";
        }
    });
});

// función para cerrar modal
function cerrarModal() {
    document.getElementById("modal-pago").style.display = "none";
}