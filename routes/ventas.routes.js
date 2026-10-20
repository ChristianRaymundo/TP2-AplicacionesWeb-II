import { Router } from 'express'
import {
    get_ventas,
    get_venta_byId,
    agregar_venta
} from '../utils/ventas.js'
import { get_producto_byId } from '../utils/productos.js'
import { get_usuario_byId } from '../utils/usuarios.js'

const router = Router()

// Obtener todas las ventas
router.get('/', (req, res) => {
    const ventas = get_ventas()
    res.status(200).json(ventas)
})

// Obtener una venta por su ID
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

// Registrar una nueva venta
router.post('/', async (req, res) => {
    try {
        const {
            id_usuario,
            telefono,
            direccion,
            delivery,
            formaPago,
            observaciones,
            productos
        } = req.body

        // Verificar los datos obligatorios
        if (
            !Number.isInteger(Number(id_usuario)) ||
            !telefono?.trim() ||
            typeof delivery !== 'boolean' ||
            !['Efectivo', 'Transferencia'].includes(formaPago) ||
            !Array.isArray(productos) ||
            productos.length === 0
        ) {
            return res.status(400).json({
                mensaje: 'Faltan datos o hay campos inválidos en el pedido'
            })
        }

        // Verificar la dirección cuando se elige delivery
        if (delivery && !direccion?.trim()) {
            return res.status(400).json({
                mensaje: 'Debe ingresar la dirección de entrega'
            })
        }

        // Verificar que el usuario exista y esté activo
        const usuario = get_usuario_byId(Number(id_usuario))

        if (!usuario || !usuario.activo) {
            return res.status(404).json({
                mensaje: 'El usuario no existe o está inactivo'
            })
        }

        let total = 0
        const productosVenta = []

        // Validar los productos y calcular sus subtotales
        for (const item of productos) {
            const producto = await get_producto_byId(Number(item.id_producto))
            const cantidad = Number(item.cantidad)

            if (
                !producto ||
                !producto.disponible ||
                !Number.isInteger(cantidad) ||
                cantidad <= 0
            ) {
                return res.status(400).json({
                    mensaje: 'Hay un producto no disponible o una cantidad inválida'
                })
            }

            const extraJQ = item.extraJQ === true

            if (extraJQ && producto.categoria !== 'Hamburguesas') {
                return res.status(400).json({
                    mensaje: 'El extra de jamón y queso no es válido para este producto'
                })
            }

            let subtotal = 0

            if (producto.categoria === 'Empanadas') {
                if (cantidad % 6 !== 0) {
                    return res.status(400).json({
                        mensaje: 'Las empanadas deben pedirse en múltiplos de 6'
                    })
                }

                subtotal = Math.floor(cantidad / 12) * 9500

                if (cantidad % 12 === 6) {
                    subtotal += 5000
                }
            } else {
                const precioUnitario = producto.precio + (extraJQ ? 500 : 0)
                subtotal = precioUnitario * cantidad
            }

            total += subtotal

            productosVenta.push({
                id_producto: producto.id,
                cantidad,
                subtotal,
                ...(extraJQ ? { extraJQ: true } : {})
            })
        }

        // Sumar el costo de entrega si corresponde
        if (delivery) {
            total += 500
        }

        // Guardar la venta vinculada al usuario
        const venta = await agregar_venta({
            id_usuario: Number(id_usuario),
            fecha: new Date().toISOString().slice(0, 10),
            telefono: telefono.trim(),
            direccion: delivery ? direccion.trim() : '',
            delivery,
            formaPago,
            observaciones: observaciones?.trim() || '',
            productos: productosVenta,
            total
        })

        res.status(201).json({
            mensaje: 'Pedido registrado correctamente',
            venta
        })
    } catch (error) {
        console.error('Error al guardar la venta:', error)

        res.status(500).json({
            mensaje: 'Error al guardar la venta'
        })
    }
})

export default router