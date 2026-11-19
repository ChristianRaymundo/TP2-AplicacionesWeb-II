import mongoose from 'mongoose'

const ProductoSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    categoria: {
        type: String,
        required: true
    },
    titulo: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    precio: {
        type: Number,
        required: true
    },
    detallePrecio: {
        type: String
    },
    imagen: {
        type: String,
        required: true
    },
    disponible: {
        type: Boolean,
        default: true
    }
})

export const Producto = mongoose.model('Producto', ProductoSchema, 'productos')