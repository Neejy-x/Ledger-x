require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')
const sequelize = require('./config/sequelize.db')
const redisClient = require('./config/redisClient.config')
const authRouter = require('./routes/auth.routes')
const healthRouter = require('./routes/health.routes')
const adminRouter = require('./routes/admin.routes')
const accountRouter = require('./routes/account.routes')
const transactionsRouter = require('./routes/transaction.routes')
const {notFound} = require('./middlewares/notFound.middleware')
const {logger, errorHandler} = require('./middlewares/error.middleware')
const app = express()



const PORT = process.env.PORT || 2102

app.use(express.json())
app.use(cookieParser())
app.use('/api/auth', authRouter)
app.use('/api/health', healthRouter)
app.use('/api/admin', adminRouter)
app.use('/api/accounts', accountRouter)
app.use('/api/transactions', transactionsRouter)
app.use(notFound)
app.use(errorHandler)

const startApp = async ()=> {
    await sequelize.authenticate()
    logger.info('Database Connection established')
    await redisClient.connect()
    app.listen(PORT, () => {
    logger.info(`Server is running on PORT ${PORT}`)
})
}

startApp()
