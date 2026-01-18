const express = require('express')
const { authHandler } = require('../middlewares/auth.middleware')

const adminRouter = express.Router()


adminRouter.get('/users', authHandler, isAdmin, getUsersHandler)
adminRouter.post('/users/status/:userId', authHandler, isAdmin,   )
adminRouter.post('/users/roles/:userId', authHandler, isAdmin,  )
adminRouter.get('/accounts', authHandler, isAdmin, )
adminRouter.post('accounts/status/:accountId', authHandler, isAdmin,  )
adminRouter.get('/ledger-entries', authHandler, isAdmin)
adminRouter.get('/audit-logs', authHandler, isAdmin,  )


module.exports = adminRouter