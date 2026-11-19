import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {
    get_usuarios,
    get_usuario_byId,
    get_usuario_byEmail,
    crear_usuario,
    actualizar_usuario
} from '../utils/usuarios.js'

const router = Router()

// Obtener todos los usuarios (sin contraseña)
router.get('/', async (req, res) => {
    try {
        const usuarios = await get_usuarios()

        res.status(200).json(usuarios)
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener los usuarios'
        })
    }
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

        // crear_usuario ya devuelve el usuario sin la contraseña
        res.status(201).json({
            mensaje: 'Usuario registrado correctamente',
            usuario: nuevoUsuario
        })
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al registrar el usuario'
        })
    }
})

// Iniciar sesión
router.post('/login', async (req, res) => {
    try {
        const email = req.body.email
        const contraseña = req.body.contraseña

        if (!email || !contraseña) {
            return res.status(400).json({
                mensaje: 'Debe completar email y contraseña'
            })
        }

        const usuario = await get_usuario_byEmail(email)

        // Compara lo que escribió con el hash guardado
        const coincide = usuario
            ? await bcrypt.compare(contraseña, usuario.contraseña)
            : false

        if (!coincide || !usuario.activo) {
            return res.status(401).json({
                mensaje: 'Email o contraseña incorrectos, o usuario inactivo'
            })
        }

        // Generar el token JWT
        const token = jwt.sign(
            {
                id: usuario.id,
                email: usuario.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '2h'
            }
        )

        res.status(200).json({
            mensaje: `Bienvenido ${usuario.nombre}`,
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                email: usuario.email
            }
        })
    } catch (error) {
        console.error('Error al procesar el login:', error)

        res.status(500).json({
            mensaje: 'Error al procesar el login'
        })
    }
})

// Obtener un usuario por su ID
router.get('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id)

        const usuario = await get_usuario_byId(id)

        if (!usuario) {
            return res.status(404).json({
                mensaje: 'Usuario no encontrado'
            })
        }

        // get_usuario_byId ya devuelve el usuario sin la contraseña
        res.status(200).json(usuario)
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener el usuario'
        })
    }
})

// Desactivar un usuario
router.delete('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id)

        const usuario = await get_usuario_byId(id)

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