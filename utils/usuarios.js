import { readFile, writeFile } from 'fs/promises'

const fileUsuarios = await readFile('./data/usuarios.json', 'utf-8')
let usuariosData = JSON.parse(fileUsuarios)

export const get_usuario_byId = (id) => {
    return usuariosData.find(u => u.id === id)
}

export const get_usuarios = () => {
    // se excluye la contraseña por seguridad, no se muestra en la respuesta
    return usuariosData.map(({ contraseña, ...resto }) => resto)
}

export const get_usuario_byEmail = (email) => {
    return usuariosData.find(u => u.email === email)
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

export const eliminar_usuario = async (id) => {
    const index = usuariosData.findIndex(u => u.id === id)

    if (index === -1) {
        return false
    }

    usuariosData.splice(index, 1)

    await writeFile(
        './data/usuarios.json',
        JSON.stringify(usuariosData, null, 2)
    )

    return true
}