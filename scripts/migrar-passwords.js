import { readFile, writeFile } from 'fs/promises'
import bcrypt from 'bcryptjs'

const migrarPasswords = async () => {
    try {
        const data = await readFile('./data/usuarios.json', 'utf-8')
        const usuarios = JSON.parse(data)

        let modificados = 0

        for (const usuario of usuarios) {
            // Si la contraseña no está hasheada, encriptarla con bcrypt
            if (usuario.contraseña && !usuario.contraseña.startsWith('$2')) {
                usuario.contraseña = await bcrypt.hash(usuario.contraseña, 10)
                modificados++
            }
        }

        // Guardar los cambios si se modificó alguna contraseña
        if (modificados > 0) {
            await writeFile('./data/usuarios.json', JSON.stringify(usuarios, null, 2))
            console.log(`Migración exitosa: ${modificados} contraseñas hasheadas.`)
        } else {
            console.log('Todo en orden: no hay contraseñas en texto plano.')
        }
    } catch (error) {
        console.error('Error en la migración:', error.message)
    }
}

migrarPasswords()