import { Router } from 'express'
import { get_usuarios, get_usuario_byId, get_usuario_byEmail, eliminar_usuario } from '../utils/usuarios.js'
import { eliminar_ventas_byUsuario } from '../utils/ventas.js'

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
    const email = req.body.email
    const contraseña = req.body.contraseña

    const usuario = get_usuario_byEmail(email)

    if (usuario && usuario.contraseña === contraseña) {
        res.status(200).json({
            mensaje: `Bienvenido ${usuario.nombre}`
        })
    } else {
        res.status(400).json({
            mensaje: 'Email o contraseña incorrectos'
        })
    }
})

router.delete('/:id', async (req, res) => {
    const id = Number(req.params.id)

    const usuario = get_usuario_byId(id)

    if (!usuario) {
        return res.status(404).json({
            mensaje: 'Usuario no encontrado'
        })
    }

    // integridad: primero eliminamos las ventas asociadas a este usuario
    await eliminar_ventas_byUsuario(id)

    // recién ahora eliminamos el usuario
    await eliminar_usuario(id)

    res.status(200).json({
        mensaje: `Usuario ${id} y sus ventas asociadas fueron eliminados`
    })
})

export default router