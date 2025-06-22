const { redisClient } = require('../config/redisClient');

const getModelByIdCache = async (modelo, id) => {
    const isCached = await redisClient.get(`${modelo.modelName}:${id}`);
    console.log(`Usuario obtenido por ${isCached ? 'cache' : 'base de datos'} `);
    return isCached;
};

const getModelsCache = async (modelo) => {
    const isCached = await redisClient.get(`${modelo.modelName}s:todos`);
    console.log(`Usuario obtenido por ${isCached ? 'cache' : 'base de datos'} `);
    return isCached; 
};

const deleteModelByIdCache = async (modelo, id) => {
    await redisClient.del(`${modelo.modelName}:${id}`);
};

const deleteModelsCache = async (modelo) => { 
    await redisClient.del(`${modelo.modelName}s:todos`);
};

module.exports = { getModelByIdCache, getModelsCache, deleteModelsCache, deleteModelByIdCache };