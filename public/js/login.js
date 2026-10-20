// Registrar un usuario
async function registrarUsuario() {
    const nombre = document.getElementById("nombre").value.trim()
    const apellido = document.getElementById("apellido").value.trim()
    const email = document.getElementById("email").value.trim()
    const contraseña = document.getElementById("password").value

    if (!nombre || !apellido || !email || !contraseña) {
        alert("Debe completar todos los campos")
        return
    }

    try {
        // Enviar los datos al servidor para registrar el usuario
        const response = await fetch('/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre,
                apellido,
                email,
                contraseña
            })
        })

        const data = await response.json()

        if (!response.ok) {
            alert(data.mensaje || "No se pudo registrar el usuario")
            return
        }

        alert("Registro exitoso. Ahora puede iniciar sesión.")
        window.location.href = "../login.html"

    } catch (error) {
        console.error("Error al registrar el usuario:", error)
        alert("No se pudo conectar con el servidor")
    }
}

// Iniciar sesión
function checkLogin() {
    const loginForm = document.getElementById("loginForm")
    if (!loginForm) return

    // Si ya inició sesión, ir al catálogo
    const usuarioGuardado = sessionStorage.getItem("usuario")

    if (usuarioGuardado) {
        window.location.href = "index.html"
        return
    }

    loginForm.addEventListener("submit", async function(e) {
        e.preventDefault()

        const email = document.getElementById("usuario").value.trim()
        const contraseña = document.getElementById("clave").value

        try {
            // Consultar al servidor para validar las credenciales
            const response = await fetch('/usuarios/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, contraseña })
            })

            const data = await response.json()

            if (!response.ok) {
                alert(data.mensaje || "Correo o contraseña incorrectos")
                return
            }

            // Guardar los datos básicos del usuario
            sessionStorage.setItem("usuario", JSON.stringify(data.usuario))

            // Recuperar el producto que intentó agregar antes de iniciar sesión
            const productoPendiente = sessionStorage.getItem("productoPendiente")

            if (productoPendiente) {
                const producto = JSON.parse(productoPendiente)

                // Obtener el carrito actual o crear uno vacío
                let carrito = JSON.parse(localStorage.getItem("carrito")) || []

                // Buscar si el producto ya existe con la misma opción de extra
                const existente = carrito.find(item =>
                    item.id === producto.id &&
                    item.extraJQ === producto.extraJQ
                )

                if (existente) {
                    existente.cantidad += producto.cantidad
                } else {
                    carrito.push(producto)
                }

                // Guardar el carrito actualizado
                localStorage.setItem("carrito", JSON.stringify(carrito))

                // Eliminar el producto pendiente
                sessionStorage.removeItem("productoPendiente")

                // Ir directamente al carrito
                window.location.href = "pages/carrito.html"

            } else {
                // Si no había producto pendiente, ir al inicio
                window.location.href = "index.html"
            }

        } catch (error) {
            console.error("Error al iniciar sesión:", error)
            alert("No se pudo conectar con el servidor")
        }
    })
}

// Verificar si el usuario inició sesión
function verificarSesion() {
    const usuario = sessionStorage.getItem("usuario")

    if (!usuario) {
        window.location.href = "/login.html"
    }
}