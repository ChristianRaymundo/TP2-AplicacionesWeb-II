import { Router } from 'express'
import {
    get_productos,
    get_producto_byId,
    actualizar_producto,
    eliminar_producto
} from '../utils/productos.js'

const router = Router()

// Obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const productos = await get_productos()
        res.status(200).json(productos)
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los productos.' })
    }
})

// Obtener un producto por ID
router.get('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id)
        const producto = await get_producto_byId(id)

        if (!producto) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' })
        }

        res.status(200).json(producto)
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener el producto.' })
    }
})

// Actualizar un producto
router.put('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id)
        const producto = await actualizar_producto(id, req.body)

        if (!producto) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' })
        }

        res.status(200).json(producto)
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar el producto.' })
    }
})

// Eliminar un producto
router.delete('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id)
        const eliminado = await eliminar_producto(id)

        if (!eliminado) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' })
        }

        res.status(200).json({ mensaje: `Producto ${id} eliminado` })
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el producto.' })
    }
})

export default router