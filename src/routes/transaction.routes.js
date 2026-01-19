const express = require('express')
const { authHandler } = require('../middlewares/auth.middleware')
const validate = require('../middlewares/validator.middleware')
const transactionSchema = require('../validators/transaction.validator')
const { transactionHandler, getTransactionsHandler, getTransactionByIdHandler } = require('../controllers/transaction.controller')
const transactionRouter = express.Router()

transactionRouter.use(authHandler)


transactionRouter.get('/', getTransactionsHandler)
transactionRouter.get('/:transactionId', getTransactionByIdHandler)

transactionRouter.post('/', validate(transactionSchema), transactionHandler)

module.exports = transactionRouter