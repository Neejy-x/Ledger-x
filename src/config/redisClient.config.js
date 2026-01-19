const { createClient } = require ('redis')
const {logger} = require('../middlewares/error.middleware')

const client = createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});

client.on('error', err => logger.error('Redis Client Error:', err));
client.on('connect', () => logger.info('Redis Client connection established'));

module.exports = client;

