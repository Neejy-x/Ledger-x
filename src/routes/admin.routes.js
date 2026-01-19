const express = require('express')
const { authHandler, isAdmin } = require('../middlewares/auth.middleware')
const validate = require('../middlewares/validator.middleware')
const { userRoleSchema, userStatusSchema } = require('../validators/admin.validator')
const { updateUserRoleHandler, getUsersHandler, getUserByIdHandler, updateUserStatusHandler, getAccountsHandler, getLogsHandler } = require('../controllers/admin.controller')

const adminRouter = express.Router()

adminRouter.use(authHandler, isAdmin)

adminRouter.get('/users', getUsersHandler)
adminRouter.get('users/:userId', getUserByIdHandler)
adminRouter.get('/accounts', getAccountsHandler)
adminRouter.get('/audit-logs', getLogsHandler)

adminRouter.patch('/users/:userId/role', validate(userRoleSchema),  updateUserRoleHandler)
adminRouter.patch('/users/:userId/status', validate(userStatusSchema), updateUserStatusHandler )
adminRouter.patch('accounts/:accountId/status', authHandler, isAdmin,  )


module.exports = adminRouter