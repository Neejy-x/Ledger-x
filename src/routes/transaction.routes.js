const express = require('express')
const { authHandler } = require('../middlewares/auth.middleware')
const validate = require('../middlewares/validator.middleware')
const transactionSchema = require('../validators/transaction.validator')
const transactionRouter = express.Router()

transactionRouter.post('/', authHandler, validate(transactionSchema), )
transactionRouter.get('/', authHandler)

module.exports = transactionRouter