const express = require('express')
const { authHandler } = require('../middlewares/auth.middleware')
const validate = require('../middlewares/validator.middleware')
const {createAccountSchema} = require('../validators/account.validator')
const { createAccountHandler, getAccounts } = require('../controllers/account.controller')

const accountRouter = express.Router()

accountRouter.post('/', authHandler, validate(createAccountSchema), createAccountHandler)
accountRouter.get('/', authHandler, getAccounts)
accountRouter.get('/:accountId')
accountRouter.post('/:accountId/close')

module.exports = accountRouter