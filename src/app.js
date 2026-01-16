require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')
const authRouter = require('./routes/auth.routes')
const accountRouter = require('./routes/account.routes')
const {notFound} = require('./middlewares/notFound.middleware')
const {logger, errorHandler} = require('./middlewares/error.middleware')
const app = express()


const { sequelize } = require('./database/models');



const PORT = process.env.PORT || 2102

app.use(express.json())
app.use(cookieParser())
app.use('/api/auth', authRouter)
app.use('/api/accounts', accountRouter)
app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => {
    logger.info(`Server is running on PORT ${PORT}`)
})