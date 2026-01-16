const {z} = require('zod')

const createAccountSchema = z.object({
    currency: z.string().optional()
}).strip()

module.exports = createAccountSchema