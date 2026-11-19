import bcrypt from 'bcryptjs'
import { Usuario } from '../db/schemas/user.schema.js'

// Obtener un usuario por su ID sin mostrar la contraseña
export const get_usuario_byId = async (id) => {
    return await Usuario.findOne({ id: id }).select('-contraseña').lean()
}

// Obtener todos los usuarios sin mostrar las contraseñas
export const get_usuarios = async () => {
    const usuarios = await Usuario.find().lean()

    return usuarios.map((usuario) => {
        return {
            id: usuario.id,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
            activo: usuario.activo
        }
    })
}

// Obtener un usuario por su email
export const get_usuario_byEmail = async (email) => {
    return await Usuario.findOne({ email: email }).lean()
}

// Registrar un usuario nuevo
export const crear_usuario = async (datosUsuario) => {
    // Verificar si el email ya está registrado
    const existe = await get_usuario_byEmail(datosUsuario.email)

    if (existe) {
        return null
    }

    // El id lo genera el servidor: el mayor id que existe + 1
    const ultimo = await Usuario.findOne().sort({ id: -1 })
    const nuevoId = ultimo ? ultimo.id + 1 : 1

    // Guardamos el hash, nunca la contraseña original
    const contraseñaHash = await bcrypt.hash(datosUsuario.contraseña, 10)

    const nuevoUsuario = new Usuario({
        id: nuevoId,
        nombre: datosUsuario.nombre,
        apellido: datosUsuario.apellido,
        email: datosUsuario.email,
        contraseña: contraseñaHash,
        activo: true
    })

    const guardado = await nuevoUsuario.save()

    // Devolver los datos sin la contraseña
    return {
        id: guardado.id,
        nombre: guardado.nombre,
        apellido: guardado.apellido,
        email: guardado.email,
        activo: guardado.activo
    }
}

// Actualizar un usuario
export const actualizar_usuario = async (id, cambios) => {
    return await Usuario.findOneAndUpdate(
        { id: id },
        cambios,
        { new: true, runValidators: true }
    ).select('-contraseña').lean()
}