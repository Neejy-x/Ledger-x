const {z} = require('zod')

const transactionSchema = z.object({
    destinationAccountId: z.string().uuid(),
    sourceAccountId: z.string().uuid(),
    idempotencyKey: z.string().uuid(),
    amount: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Invalid amount format")
    .refine(val => Number(val) > 0, {
      message: "Amount must be greater than zero"
    }),
    transactionPin:  z.string()
    .length(4, "Transaction PIN must be exactly 4 digits")
    .regex(/^\d+$/, "PIN must contain only numbers")
})

module.exports = transactionSchema;