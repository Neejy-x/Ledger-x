require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')
const redisClient = require('./config/redisClient.config')
const authRouter = require('./routes/auth.routes')
const healthRouter = require('./routes/health.routes')
const accountRouter = require('./routes/account.routes')
const transactionsRouter = require('./routes/transaction.routes')
const {notFound} = require('./middlewares/notFound.middleware')
const {logger, errorHandler} = require('./middlewares/error.middleware')
const app = express()


const { sequelize } = require('./database/models');


const PORT = process.env.PORT || 2102

app.use(express.json())
app.use(cookieParser())
app.use('/api/auth', authRouter)
app.use('/admin/health', healthRouter)
app.use('/api/accounts', accountRouter)
app.use('/transactions', transactionsRouter)
app.use(notFound)
app.use(errorHandler)

const startApp = async ()=> {
    await redisClient.connect()
    app.listen(PORT, () => {
    logger.info(`Server is running on PORT ${PORT}`)
})
}

startApp()
