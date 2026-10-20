 // Categorías de la tienda
const paginasProtegidas = [
    { titulo: "Empanadas", link: "pages/categoria1.html" },
    { titulo: "Pizzas", link: "pages/categoria2.html" },
    { titulo: "Papas", link: "pages/categoria3.html" },
    { titulo: "Hamburguesas", link: "pages/categoria4.html" },
    { titulo: "Tortillas", link: "pages/categoria5.html" }
]

// Generar el navbar según la sesión
function generarNavbar() {
    const nav = document.querySelector(".navbar")
    if (!nav) return

    const dentroDePages = window.location.pathname.includes("/pages/")
    const basePath = dentroDePages ? "../" : ""
    const usuario = sessionStorage.getItem("usuario")

    let html = `
        <div class="logo">
            <a href="${basePath}index.html">
                <img src="${basePath}assets/imagenes/logo-roti.png" alt="Logo La Colonia">
                <span>La Colonia</span>
            </a>
        </div>

        <ul class="nav-links">
            <li><a href="${basePath}index.html">Inicio</a></li>
            <li><a href="${basePath}pages/productos.html">Productos</a></li>
    `

    if (usuario) {
        // Menú para usuarios que iniciaron sesión
        paginasProtegidas.forEach(p => {
            html += `<li><a href="${basePath}${p.link}">${p.titulo}</a></li>`
        })

        html += `
            <li>
                <a href="${basePath}pages/carrito.html" class="carrito-btn">
                    🛒 Carrito
                </a>
            </li>
            <li>
                <button type="button" class="logout-btn" onclick="logoutUser()">
                    Cerrar sesión
                </button>
            </li>
        `
    } else {
        // Menú para visitantes
        html += `
            <li><a href="${basePath}login.html">Iniciar sesión</a></li>
            <li><a href="${basePath}pages/registro.html">Registrarse</a></li>
        `
    }

    html += `</ul>`

    nav.innerHTML = html
}

document.addEventListener("DOMContentLoaded", generarNavbar)

// Cerrar sesión y volver al inicio
function logoutUser() {
    sessionStorage.removeItem("usuario");

    const dentroDePages = window.location.pathname.includes("/pages/");
    const basePath = dentroDePages ? "../" : "";

    window.location.href = `${basePath}index.html`;
}