import mongoose from 'mongoose'

// Datos de cada producto incluido en una venta
const ItemVentaSchema = new mongoose.Schema({
    id_producto: { type: Number, required: true },
    cantidad: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    extraJQ: { type: Boolean }
}, {
    _id: false,
    toJSON: { virtuals: true }
})

// Relacionar el producto con su ID en la colección productos
ItemVentaSchema.virtual('producto', {
    ref: 'Producto',
    localField: 'id_producto',
    foreignField: 'id',
    justOne: true
})

// Estructura de una venta
const VentaSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    id_usuario: { type: Number, required: true },
    fecha: { type: String, required: true },
    telefono: { type: String, required: true },
    direccion: { type: String, default: '' },
    delivery: { type: Boolean, required: true },
    formaPago: { type: String, required: true },
    observaciones: { type: String, default: '' },
    productos: [ItemVentaSchema],
    total: { type: Number, required: true }
}, {
    timestamps: true,
    toJSON: { virtuals: true }
})

// Relacionar la venta con el usuario correspondiente
VentaSchema.virtual('usuario', {
    ref: 'Usuario',
    localField: 'id_usuario',
    foreignField: 'id',
    justOne: true
})

export const Venta = mongoose.model('Venta', VentaSchema, 'ventas')