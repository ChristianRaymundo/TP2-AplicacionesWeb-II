import 'dotenv/config'
import { readFile } from 'fs/promises'
import { conectarDB, desconectarDB } from '../db/connection.js'
import { Usuario } from '../db/schemas/user.schema.js'
import { Producto } from '../db/schemas/product.schema.js'
import { Venta } from '../db/schemas/ventas.schema.js'

// Leer los archivos JSON de la carpeta data
const leerJSON = async (archivo) => {
    const data = await readFile(`./data/${archivo}`, 'utf-8')
    return JSON.parse(data)
}

// Migrar los datos de los archivos JSON a Mongo
const migrarDatos = async () => {
    try {
        // Conectar a MongoDB
        await conectarDB()

        // Leer los tres archivos JSON
        const usuarios = await leerJSON('usuarios.json')
        const productos = await leerJSON('productos.json')
        const ventas = await leerJSON('ventas.json')

        // Comprobar que los archivos tengan datos
        if (usuarios.length === 0 || productos.length === 0) {
            console.log('No hay usuarios o productos para migrar.')
            return
        }

        // Limpiar las colecciones antes de cargar los datos nuevamente
        await Usuario.deleteMany({})
        await Producto.deleteMany({})
        await Venta.deleteMany({})

        // Insertar los datos en MongoDB
        await Usuario.insertMany(usuarios)
        await Producto.insertMany(productos)
        await Venta.insertMany(ventas)

        // Muestro la cantidad de registros migrados
        console.log('Migración exitosa:')
        console.log(`${usuarios.length} usuarios migrados.`)
        console.log(`${productos.length} productos migrados.`)
        console.log(`${ventas.length} ventas migradas.`)

    } catch (error) {
        console.error('Error en la migración:', error.message)
    } finally {
        // Cerrar la conexion con MongoDB al finalizar
        await desconectarDB()
    }
}

migrarDatos()