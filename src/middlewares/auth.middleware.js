
const jwt = require('jsonwebtoken')


export const authHandler = (req, res, next)=> {
   try{
    const authHeader = req.headers.authorization || req.headers.authorization
    if(!authHeader?.startsWith('Bearer ')) return res.status(401).json({message: 'Unauthorized: no token provided'})

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    req.user = {
        id: decoded.id,
        role: decoded.role
    }
    next()
   }catch(e){
    if(e.name === 'JsonWebTokenError' || e.name === 'TokenExpiredError'){
        e = new Error('Forbidden: Invalid or Expired token')
        e.statusCode = 403
        return next(e)
    }
    return next(e)
   }

}

export const isAdmin = (req, res, next) => {
    const { role } = req.user
    if(role !== 'admin'){
        return res.status(401).json({message: `Unauthorized: ${role} not allowed`})
    }
    next()
}