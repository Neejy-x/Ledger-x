const winston = require('winston')

const {timestamp, json, prettyPrint, errors, simple, combine} = winston.format

const logger = winston.createLogger({
    level: 'info',
    format: combine(timestamp(), json(), errors({stack: true})),
    transports: [
        new winston.transports.File({filename: 'src/logs/app.log'}),
        new winston.transports.Console({format: simple()})
    ],
    exceptionHandlers: [
        new winston.transports.File({filename: 'src/logs/exceptions.log'}),
        new winston.transports.Console({
            format: simple()
        })
    ],
    rejectionHandlers: [
        new winston.transports.File({filename: 'src/logs/rejections.log'}),
        new winston.transports.Console({
            format: combine(simple(), errors({stack: true}))
        })
    ],
    exitOnError: false
})

const errorHandler = (err, req, res, next) => {
    if(err.name ==='ZodError'){
        return res.status(400).json({errors: err.format()})
    }

    const statusCode = err.statusCode || 500
    const message = err.message || 'internal server error'
    logger.error(`${err.name} ${err.message}`, {stack: err.stack})
    res.status(statusCode).json({
        status: 'error',
        message
    })
}

module.exports = {logger, errorHandler}