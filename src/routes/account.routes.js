const express = require('express')
const { authHandler } = require('../middlewares/auth.middleware')
const validate = require('../middlewares/validator.middleware')
const createAccountSchema = require('../validators/account.validator')
const { createAccountHandler, getAccountsHandler, getAccountByIdHandler, closeAccountHandler } = require('../controllers/account.controller')
const { getBalanceHandler } = require('../controllers/balance.controller')

const accountRouter = express.Router()

accountRouter.post('/', authHandler, validate(createAccountSchema), createAccountHandler)
accountRouter.get('/', authHandler, getAccountsHandler)
accountRouter.get('/:accountId', authHandler, getAccountByIdHandler)
accountRouter.post('/:accountId/close', authHandler, closeAccountHandler)
accountRouter.get('/:accountId/balance', authHandler, getBalanceHandler)

module.exports = accountRouter