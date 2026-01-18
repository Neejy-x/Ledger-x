const {sequelize} = require('../database/models')
const redisClient = require('../config/redisClient.config')
const {logger} = require('../middlewares/error.middleware')


const healthHandler = async(req, res) => {
    const healthCheck = {
        uptime: process.uptime(),
        message: 'OK',
        timestamp: Date.now()
    }

    try{
        await sequelize.authenticate()
        await redisClient.ping()
        logger.info('Health check successful', healthCheck)
        return res.json(healthCheck)
   } catch(e){
    healthCheck.message = e.message
    return res.status(500).json(healthCheck)
    }
}

module.exports = healthHandler