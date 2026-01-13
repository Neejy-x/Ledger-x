const express = require('express')
require('dotenv').config()
const {notFound} = require('./middlewares/404Handler')
const {logger, errorHandler} = require('./middlewares/errorHandler')
const app = express()


const PORT = process.env.PORT || 2102


app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => {
    logger.info(`Server is running on PORT ${PORT}`)
})