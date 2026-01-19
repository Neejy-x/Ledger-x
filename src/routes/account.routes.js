const express = require('express')
const { authHandler } = require('../middlewares/auth.middleware')
const validate = require('../middlewares/validator.middleware')
const createAccountSchema = require('../validators/account.validator')
const { createAccountHandler, getAccountsHandler, getAccountByIdHandler, closeAccountHandler } = require('../controllers/account.controller')
const { getBalanceHandler } = require('../controllers/balance.controller')

const accountRouter = express.Router()

accountRouter.use(authHandler)

accountRouter.get('/', getAccountsHandler)
accountRouter.get('/:accountId', getAccountByIdHandler)
accountRouter.get('/:accountId/balance', getBalanceHandler) //cached balance



accountRouter.post('/', validate(createAccountSchema), createAccountHandler)

accountRouter.patch('/:accountId/close', closeAccountHandler)

module.exports = accountRouter