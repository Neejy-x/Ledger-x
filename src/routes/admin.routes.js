const express = require('express')
const { authHandler } = require('../middlewares/auth.middleware')
const validate = require('../middlewares/validator.middleware')
const { userRoleSchema, userStatusSchema } = require('../validators/admin.validator')
const { updateUserRoleHandler, getUsersHandler } = require('../controllers/admin.controller')

const adminRouter = express.Router()


adminRouter.get('/users', authHandler, isAdmin, getUsersHandler)
adminRouter.post('/users/roles/:userId', validate(userRoleSchema), authHandler, isAdmin,   updateUserRoleHandler)
adminRouter.post('/users/status/:userId', validate(userStatusSchema), authHandler, isAdmin,  )
adminRouter.get('/accounts', authHandler, isAdmin, )
adminRouter.post('accounts/status/:accountId', authHandler, isAdmin,  )
adminRouter.get('/ledger-entries', authHandler, isAdmin)
adminRouter.get('/audit-logs', authHandler, isAdmin,  )


module.exports = adminRouter