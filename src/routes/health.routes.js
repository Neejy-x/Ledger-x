const express = require('express')
const { authHandler, isAdmin } = require('../middlewares/auth.middleware')
const healthHandler = require('../controllers/health.controllers')
const healthRouter = express.Router()

healthRouter.get('/', authHandler,  healthHandler)

module.exports = healthRouter