const {z} = require('zod')

exports.userRoleSchema = z.object({
    role: z.enum(['user', 'admin'])
})

exports.userStatusSchema = z.object({
    status: z.enum(['active', 'suspended'])
})