import mongoose from 'mongoose'

const UsuarioSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contraseña: { type: String, required: true },
    activo: { type: Boolean, default: true }
}, {
    timestamps: true   // agrega createdAt y updatedAt automáticamente
})

export const Usuario = mongoose.model('Usuario', UsuarioSchema, 'usuarios')