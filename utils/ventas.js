import { readFile, writeFile } from 'fs/promises'

// Leer las ventas guardadas en el archivo JSON
const fileVentas = await readFile('./data/ventas.json', 'utf-8')
let ventasData = JSON.parse(fileVentas)

// Buscar una venta por su ID
export const get_venta_byId = (id) => {
    return ventasData.find(v => v.id === id)
}

// Obtener las ventas de un usuario
export const get_ventas_byUsuario = (id_usuario) => {
    return ventasData.filter(v => v.id_usuario === id_usuario)
}

// Obtener todas las ventas
export const get_ventas = () => {
    return ventasData
}

// Agregar una nueva venta
export const agregar_venta = async (nuevaVenta) => {
    // Generar un ID para la nueva venta
    const nuevoId = ventasData.length > 0
        ? Math.max(...ventasData.map(v => v.id)) + 1
        : 1

    // Agregar el ID a los datos de la venta
    const ventaConId = {
        id: nuevoId,
        ...nuevaVenta
    }

    // Guardar la venta y actualizar el archivo JSON
    ventasData.push(ventaConId)

    await writeFile(
        './data/ventas.json',
        JSON.stringify(ventasData, null, 2)
    )

    return ventaConId
}