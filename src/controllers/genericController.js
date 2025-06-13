const getModelByIdCache = async (modelo, id) => {
    return await redisClient.get(`${modelo.name}:${id}`);
};

const getModelsCache = async (modelo) => {
    return await redisClient.get(`${modelo.name}s:todos`); 
};

const deleteModelByIdCache = async (modelo, id) => {
    await redisClient.del(`${modelo.name}:${id}`);
};

const deleteModelsCache = async (modelo) => { 
    await redisClient.del(`${modelo.name}s:todos`);
};

module.exports = { getModelByIdCache, getModelsCache, deleteModelsCache, deleteModelByIdCache };