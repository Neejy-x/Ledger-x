const {z} = require('zod')

export const signupSchema = z.object({
    first_name: z.string().nonempty('First name cannot be empty'),
    last_name: z.string().nonempty('Last name cannot be empty'),
    email: z.string().trim().email('invalid email address'),
    password: z.string().min(6, 'password must be at least 6 characters long')
})

export const loginSchema = z.object({
    email: z.string().trim().email(),
    password: z.string()
})