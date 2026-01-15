const express = require('express')
require('dotenv').config()
const cookieParser = require('cookie-parser')
const {notFound} = require('./middlewares/notFound.controller')
const {logger, errorHandler} = require('./middlewares/error.controller')
const app = express()


const PORT = process.env.PORT || 2102

app.use(express.json())
app.use(cookieParser())

app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => {
    logger.info(`Server is running on PORT ${PORT}`)
})