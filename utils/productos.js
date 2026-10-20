import { readFile, writeFile } from 'fs/promises'

const rutaProductos = './data/productos.json'

// Leer los productos actualizados desde el archivo
const leerProductos = async () => {
    const archivo = await readFile(rutaProductos, 'utf-8')
    return JSON.parse(archivo)
}

// Obtener todos los productos o filtrar por categoría
export const get_productos = async (categoria) => {
    const productosData = await leerProductos()

    if (categoria) {
        return productosData.filter(
            p => p.categoria.toLowerCase() === categoria.toLowerCase()
        )
    }

    return productosData
}

// Obtener un producto por su ID
export const get_producto_byId = async (id) => {
    const productosData = await leerProductos()
    return productosData.find(p => p.id === id)
}

// Actualizar un producto
export const actualizar_producto = async (id, cambios) => {
    const productosData = await leerProductos()
    const index = productosData.findIndex(p => p.id === id)

    if (index === -1) {
        return null
    }

    productosData[index] = {
        ...productosData[index],
        ...cambios
    }

    await writeFile(
        rutaProductos,
        JSON.stringify(productosData, null, 2)
    )

    return productosData[index]
}

// Eliminar un producto
export const eliminar_producto = async (id) => {
    const productosData = await leerProductos()
    const index = productosData.findIndex(p => p.id === id)

    if (index === -1) {
        return false
    }

    productosData.splice(index, 1)

    await writeFile(
        rutaProductos,
        JSON.stringify(productosData, null, 2)
    )

    return true
}