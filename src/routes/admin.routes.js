const express = require('express')
const { authHandler, isAdmin } = require('../middlewares/auth.middleware')
const validate = require('../middlewares/validator.middleware')
const { userRoleSchema, userStatusSchema } = require('../validators/admin.validator')
const { updateUserRoleHandler, getUsersHandler, getUserByIdHandler, updateUserStatusHandler } = require('../controllers/admin.controller')

const adminRouter = express.Router()

adminRouter.use(authHandler, isAdmin)

adminRouter.get('/users', getUsersHandler)
adminRouter.get('users/:userId', getUserByIdHandler)

adminRouter.patch('/users/:userId/role', validate(userRoleSchema),  updateUserRoleHandler)
adminRouter.patch('/users/:userId/status', validate(userStatusSchema), updateUserStatusHandler )

adminRouter.get('/accounts', authHandler, isAdmin, )
adminRouter.post('accounts/:accountId/status', authHandler, isAdmin,  )
adminRouter.get('/ledger-entries', authHandler, isAdmin)
adminRouter.get('/audit-logs', authHandler, isAdmin,  )


module.exports = adminRouter