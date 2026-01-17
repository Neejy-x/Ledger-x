const express = require('express')
const { authHandler } = require('../middlewares/auth.middleware')
const validate = require('../middlewares/validator.middleware')
const transactionSchema = require('../validators/transaction.validator')
const { transactionHandler } = require('../controllers/transaction.controller')
const { getAccountsHandler } = require('../controllers/account.controller')
const transactionRouter = express.Router()

transactionRouter.post('/', authHandler, validate(transactionSchema), transactionHandler)
transactionRouter.get('/', authHandler, getAccountsHandler)
transactionRouter.get('/:transactionId', authHandler)

module.exports = transactionRouter