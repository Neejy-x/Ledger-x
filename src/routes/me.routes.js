const express = require('express')
const { authHandler } = require('../middlewares/auth.middleware')
const meRouter = express.Router()

meRouter.get('/', authHandler, )


module.exports = meRouter