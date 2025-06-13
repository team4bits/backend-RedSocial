const { createClient } = require('redis');

const redisClient = createClient();

redisClient.on('error', (err) => console.error('Redis error: ', err));

let isConnected;

const conectarRedis = async () => {
    console.log('Conectando a Redis...');
    if (!isConnected) {
        await redisClient.connect();
        console.log('Conectado correctamente a Redis');
        isConnected = true;
    }
}

module.exports = { redisClient, conectarRedis };