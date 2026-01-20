const { rateLimit } = require('express-rate-limit');
const { RedisStore } = require('rate-limit-redis');
const redisClient = require('../config/redisClient.config');

// Helper to create a store with a unique prefix
const createStore = (prefix) => new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
    prefix: `rl:${prefix}:`
});

const limiter = rateLimit({
    store: createStore('general'),
    windowMs: 15 * 60 * 1000,
    limit: 100,
    message: {
        status: 429,
        error: 'Too Many Requests',
        message: 'General limit exceeded, try again in 15 minutes'
    },
    standardHeaders: 'draft-7', 
    legacyHeaders: false
});

// 2. Strict Auth Limiter (for Login/Signup)
const authLimiter = rateLimit({
    store: createStore('auth'),
    windowMs: 15 * 60 * 1000,
    limit: 5, 
    message: {
        status: 429,
        error: 'Security Limit',
        message: 'Too many auth attempts. Please wait 15 minutes.'
    },
    standardHeaders: 'draft-7',
    legacyHeaders: false
});

module.exports = { limiter, authLimiter };