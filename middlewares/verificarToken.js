import jwt from 'jsonwebtoken'

// Verificar el token JWT
export const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({
            mensaje: 'Acceso denegado. Token no proporcionado'
        })
    }

    try {
        const verificado = jwt.verify(token, process.env.JWT_SECRET)

        // Guardar los datos del usuario para utilizarlos en la ruta
        req.usuario = verificado

        next()
    } catch (error) {
        return res.status(403).json({
            mensaje: 'Token inválido o vencido'
        })
    }
}