import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import usuariosRouter from './routes/usuarios.routes.js'
import productosRouter from './routes/productos.routes.js'
import ventasRouter from './routes/ventas.routes.js'
import { conectarDB } from './db/connection.js'

dotenv.config() // cargo las variables de entorno del archivo .env

const app = express()

// habilita CORS para cualquier origen (*)
app.use(cors({ origin: '*' }))

app.use(express.json())

const port = process.env.PORT || 3000

// sirve el front desde la carpeta public
app.use(express.static('./public'))

// rutas de la API
app.use('/usuarios', usuariosRouter)
app.use('/productos', productosRouter)
app.use('/ventas', ventasRouter)

// conecta a MongoDB y luego inicia el servidor
const iniciarServidor = async () => {
    await conectarDB()

    app.listen(port, () => {
        console.log(`Servidor levantado en puerto ${port}`)
    })
}

iniciarServidor()