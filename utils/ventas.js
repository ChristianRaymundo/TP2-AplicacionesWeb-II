import { readFile, writeFile } from 'fs/promises'

const fileVentas = await readFile('./data/ventas.json', 'utf-8')
let ventasData = JSON.parse(fileVentas)

export const get_venta_byId = (id) => {
    return ventasData.find(v => v.id === id)
}

export const get_ventas_byUsuario = (id_usuario) => {
    return ventasData.filter(v => v.id_usuario === id_usuario)
}

export const get_ventas = () => {
    return ventasData
}

export const agregar_venta = async (nuevaVenta) => {
    ventasData.push(nuevaVenta)

    await writeFile(
        './data/ventas.json',
        JSON.stringify(ventasData, null, 2)
    )

    return nuevaVenta
}