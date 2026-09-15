import express from 'express'
import dotenv from 'dotenv'
import usuariosRouter from './routes/usuarios.routes.js'
import productosRouter from './routes/productos.routes.js'
import ventasRouter from './routes/ventas.routes.js'

dotenv.config()

const app = express()

app.use(express.json())

const port = process.env.PORT || 3000

app.use('/usuarios', usuariosRouter)
app.use('/productos', productosRouter)
app.use('/ventas', ventasRouter)

app.listen(port, () => {
    console.log(`Servidor levantado en puerto ${port}`)
})