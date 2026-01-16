const {z} = require('zod')

const createAccountSchema = z.object({
    currency: z.string().toLowerCase().length().default('ngn').optional()
}).strip()

module.exports = createAccountSchema