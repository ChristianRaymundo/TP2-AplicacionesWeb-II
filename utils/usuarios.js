import { readFile, writeFile } from 'fs/promises'

const fileUsuarios = await readFile('./data/usuarios.json', 'utf-8')
let usuariosData = JSON.parse(fileUsuarios)

export const get_usuario_byId = (id) => {
    return usuariosData.find(u => u.id === id)
}

export const get_usuarios = () => {
    // armamos una lista nueva sin el campo contraseña, por seguridad
    const usuariosSinPassword = usuariosData.map((usuario) => {
        return {
            id: usuario.id,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
            activo: usuario.activo
        }
    })

    return usuariosSinPassword
}

export const get_usuario_byEmail = (email) => {
    return usuariosData.find(u => u.email === email)
}

// Registrar un usuario nuevo
export const crear_usuario = async (datosUsuario) => {
    // Verificar si el email ya está registrado
    const existe = get_usuario_byEmail(datosUsuario.email)

    if (existe) {
        return null
    }

    // Generar el siguiente ID disponible
    const nuevoId = usuariosData.length > 0
        ? Math.max(...usuariosData.map(u => u.id)) + 1
        : 1

    const nuevoUsuario = {
        id: nuevoId,
        nombre: datosUsuario.nombre,
        apellido: datosUsuario.apellido,
        email: datosUsuario.email,
        contraseña: datosUsuario.contraseña,
        activo: true
    }

    usuariosData.push(nuevoUsuario)

    // Guardar los cambios en el archivo JSON
    await writeFile(
        './data/usuarios.json',
        JSON.stringify(usuariosData, null, 2)
    )

    return nuevoUsuario
}

export const actualizar_usuario = async (id, cambios) => {
    const index = usuariosData.findIndex(u => u.id === id)

    if (index === -1) {
        return null
    }

    usuariosData[index] = {
        ...usuariosData[index],
        ...cambios
    }

    await writeFile(
        './data/usuarios.json',
        JSON.stringify(usuariosData, null, 2)
    )

    return usuariosData[index]
}