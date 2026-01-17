
const {sequelize} = require('../database/models')
const redisClient = require('../config/redisClient.config')

const healthHandler = async (req, res) => {
    const healthCheck = {
         uptime: process.uptime(),
         message: 'OK',
         timsestamp: Date.now()
    }

    try{
        await sequelize.authenticate()
        await redisClient.ping()
        res.send(healthCheck)
    }catch(e){
        healthCheck.message = e.message
        res.status(500).send(healthCheck)
    }
}

module.exports = healthHandler