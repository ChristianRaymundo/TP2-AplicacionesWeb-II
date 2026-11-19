import { Producto } from '../db/schemas/product.schema.js'

// Obtener todos los productos o filtrar por categoría
export const get_productos = async (categoria) => {
    if (categoria) {
        return await Producto.find({
            categoria: { $regex: new RegExp(`^${categoria}$`, 'i') }
        })
    }

    return await Producto.find()
}

// Obtener un producto por su ID
export const get_producto_byId = async (id) => {
    return await Producto.findOne({ id: id })
}

// Actualizar un producto
export const actualizar_producto = async (id, cambios) => {
    return await Producto.findOneAndUpdate(
        { id: id },
        cambios,
        { new: true, runValidators: true }
    )
}

// Eliminar un producto
export const eliminar_producto = async (id) => {
    const producto = await Producto.findOneAndDelete({ id: id })

    return producto !== null
}

// Crear un producto
export const agregar_producto = async (datos) => {
    const nuevoProducto = new Producto(datos)

    return await nuevoProducto.save()
}