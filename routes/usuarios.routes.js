import { Router } from 'express'
import {
    get_usuarios,
    get_usuario_byId,
    get_usuario_byEmail,
    crear_usuario,
    actualizar_usuario
} from '../utils/usuarios.js'

const router = Router()

router.get('/', (req, res) => {
    const usuarios = get_usuarios()

    res.status(200).json(usuarios)
})

// Registrar un usuario
router.post('/', async (req, res) => {
    try {
        const { nombre, apellido, email, contraseña } = req.body

        if (!nombre || !apellido || !email || !contraseña) {
            return res.status(400).json({
                mensaje: 'Debe completar todos los campos'
            })
        }

        const nuevoUsuario = await crear_usuario({
            nombre,
            apellido,
            email,
            contraseña
        })

        if (!nuevoUsuario) {
            return res.status(409).json({
                mensaje: 'Ese email ya está registrado'
            })
        }

        // No enviamos la contraseña al cliente
        const { contraseña: password, ...usuarioSinPassword } = nuevoUsuario

        res.status(201).json({
            mensaje: 'Usuario registrado correctamente',
            usuario: usuarioSinPassword
        })
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al registrar el usuario'
        })
    }
})

// Iniciar sesión
router.post('/login', (req, res) => {
    try {
        const email = req.body.email
        const contraseña = req.body.contraseña

        const usuario = get_usuario_byEmail(email)

        if (!usuario || usuario.contraseña !== contraseña || !usuario.activo) {
            return res.status(401).json({
                mensaje: 'Email o contraseña incorrectos, o usuario inactivo'
            })
        }

        res.status(200).json({
            mensaje: `Bienvenido ${usuario.nombre}`,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                email: usuario.email
            }
        })
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al procesar el login'
        })
    }
})

router.get('/:id', (req, res) => {
    const id = Number(req.params.id)

    const usuario = get_usuario_byId(id)

    if (!usuario) {
        return res.status(404).json({
            mensaje: 'Usuario no encontrado'
        })
    }

    // No mostrar la contraseña
    const { contraseña, ...usuarioSinPassword } = usuario

    res.status(200).json(usuarioSinPassword)
})

router.delete('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id)

        const usuario = get_usuario_byId(id)

        if (!usuario) {
            return res.status(404).json({
                mensaje: 'Usuario no encontrado'
            })
        }

        // No borramos el usuario: lo marcamos como inactivo
        // Así las ventas que ya tiene siguen siendo válidas
        await actualizar_usuario(id, { activo: false })

        res.status(200).json({
            mensaje: `Usuario ${id} fue desactivado`
        })
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al desactivar el usuario'
        })
    }
})

export default router