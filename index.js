import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import usuariosRouter from './routes/usuarios.routes.js'
import productosRouter from './routes/productos.routes.js'
import ventasRouter from './routes/ventas.routes.js'

dotenv.config()

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

app.listen(port, () => {
    console.log(`Servidor levantado en puerto ${port}`)
})