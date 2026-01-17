const express = require('express')
const { authHandler } = require('../middlewares/auth.middleware')
const validate = require('../middlewares/validator.middleware')
const transactionSchema = require('../validators/transaction.validator')
const { transactionHandler, getTransactionsHandler, getTransactionByIdHandler } = require('../controllers/transaction.controller')
const transactionRouter = express.Router()

transactionRouter.post('/', authHandler, validate(transactionSchema), transactionHandler)
transactionRouter.get('/', authHandler, getTransactionsHandler)
transactionRouter.get('/:transactionId', authHandler, getTransactionByIdHandler)

module.exports = transactionRouter