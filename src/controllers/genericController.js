const { redisClient } = require('../config/redisClient');

const getModelByIdCache = async (modelo, id) => {
    return await redisClient.get(`${modelo.modelName}:${id}`);
};

const getModelsCache = async (modelo) => {
    return await redisClient.get(`${modelo.modelName}s:todos`); 
};

const deleteModelByIdCache = async (modelo, id) => {
    await redisClient.del(`${modelo.modelName}:${id}`);
};

const deleteModelsCache = async (modelo) => { 
    await redisClient.del(`${modelo.modelName}s:todos`);
};

module.exports = { getModelByIdCache, getModelsCache, deleteModelsCache, deleteModelByIdCache };