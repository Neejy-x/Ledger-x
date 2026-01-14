import { createClient } from 'redis';

const client = createClient({
    username: 'default',
    password: 'j7Pkm1E3kHIizb0Dd68nU61m9xmt61F4',
    socket: {
        host: 'redis-12575.c17.us-east-1-4.ec2.cloud.redislabs.com',
        port: 12575
    }
});

client.on('error', err => console.log('Redis Client Error', err));

await client.connect();

Model.exports = client;

