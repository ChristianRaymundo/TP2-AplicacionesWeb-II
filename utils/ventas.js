import { Venta } from '../db/schemas/ventas.schema.js'

// Obtener todas las ventas con sus usuarios y productos
export const get_ventas = async () => {
    return await Venta.find()
        .populate('usuario', 'id nombre apellido email')
        .populate('productos.producto', 'id titulo categoria precio')
}

// Buscar una venta por su ID
export const get_venta_byId = async (id) => {
    return await Venta.findOne({ id: id })
        .populate('usuario', 'id nombre apellido email')
        .populate('productos.producto', 'id titulo categoria precio')
}

// Obtener las ventas de un usuario
export const get_ventas_byUsuario = async (id_usuario) => {
    return await Venta.find({ id_usuario: id_usuario })
        .populate('usuario', 'id nombre apellido email')
        .populate('productos.producto', 'id titulo categoria precio')
}

// Registrar una nueva venta
export const agregar_venta = async (nuevaVenta) => {
    // El ID lo genera el servidor: el mayor ID que existe + 1
    const ultimaVenta = await Venta.findOne().sort({ id: -1 })
    const nuevoId = ultimaVenta ? ultimaVenta.id + 1 : 1

    // Crear y guardar la venta
    const venta = new Venta({
        id: nuevoId,
        ...nuevaVenta
    })

    return await venta.save()
}