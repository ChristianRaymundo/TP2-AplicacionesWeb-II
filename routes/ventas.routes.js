import { Router } from 'express'
import { get_ventas, get_venta_byId, agregar_venta } from '../utils/ventas.js'

const router = Router()

router.get('/', (req, res) => {
    const ventas = get_ventas()

    res.status(200).json(ventas)
})

router.get('/:id', (req, res) => {
    const id = Number(req.params.id)

    const venta = get_venta_byId(id)

    if (!venta) {
        return res.status(404).json({
            mensaje: 'Venta no encontrada'
        })
    }

    res.status(200).json(venta)
})

router.post('/', async (req, res) => {
    try {
        const nuevaVenta = req.body

        const venta = await agregar_venta(nuevaVenta)

        res.status(201).json(venta)
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al guardar la venta.' })
    }
})

export default router