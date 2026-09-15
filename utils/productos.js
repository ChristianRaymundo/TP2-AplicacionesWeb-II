import { readFile, writeFile } from 'fs/promises'

const fileProductos = await readFile('./data/productos.json', 'utf-8')
let productosData = JSON.parse(fileProductos)

export const get_productos = (categoria) => {
    if (categoria) {
        return productosData.filter(
            p => p.categoria.toLowerCase() === categoria.toLowerCase()
        )
    }

    return productosData
}

export const get_producto_byId = (id) => {
    return productosData.find(p => p.id === id)
}

export const actualizar_producto = async (id, cambios) => {
    const index = productosData.findIndex(p => p.id === id)

    if (index === -1) {
        return null
    }

    productosData[index] = {
        ...productosData[index],
        ...cambios
    }

    await writeFile(
        './data/productos.json',
        JSON.stringify(productosData, null, 2)
    )

    return productosData[index]
}

export const eliminar_producto = async (id) => {
    const index = productosData.findIndex(p => p.id === id)

    if (index === -1) {
        return false
    }

    productosData.splice(index, 1)

    await writeFile(
        './data/productos.json',
        JSON.stringify(productosData, null, 2)
    )

    return true
}