const { createClient } = require ('redis')

const client = createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: 12575
    }
});

client.on('error', err => console.error('Redis Client Error:', err));
client.on('connect', () => console.log('Redis Client Connected'));

module.exports = client;

