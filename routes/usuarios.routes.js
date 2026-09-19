import { Router } from 'express'
import { get_usuarios, get_usuario_byId, get_usuario_byEmail, actualizar_usuario } from '../utils/usuarios.js'

const router = Router()

router.get('/', (req, res) => {
    const usuarios = get_usuarios()

    res.status(200).json(usuarios)
})

router.get('/:id', (req, res) => {
    const id = Number(req.params.id)

    const usuario = get_usuario_byId(id)

    if (!usuario) {
        return res.status(404).json({
            mensaje: 'Usuario no encontrado'
        })
    }

    res.status(200).json(usuario)
})

router.post('/login', (req, res) => {
    try {
        const email = req.body.email
        const contraseña = req.body.contraseña

        const usuario = get_usuario_byEmail(email)

        if (usuario && usuario.contraseña === contraseña) {
            res.status(200).json({
                mensaje: `Bienvenido ${usuario.nombre}`
            })
        } else {
            res.status(401).json({
                mensaje: 'Email o contraseña incorrectos'
            })
        }
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al procesar el login.' })
    }
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

        // no borramos el usuario de verdad: lo marcamos como inactivo
        // asi las ventas que ya tiene siguen siendo validas
        await actualizar_usuario(id, { activo: false })

        res.status(200).json({
            mensaje: `Usuario ${id} fue desactivado`
        })
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al desactivar el usuario.' })
    }
})

export default router