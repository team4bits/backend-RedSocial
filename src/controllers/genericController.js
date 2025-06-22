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
    console.log(`Eliminando cache de ${modelo.modelName} con id ${id}`);
    await redisClient.del(`${modelo.modelName}:${id}`);
};

const deleteModelsCache = async (modelo) => { 
    await redisClient.del(`${modelo.modelName}s:todos`);
};

//Controlador genérico para borrar varios modelos de la cache
const deleteManyModelsCache = async (modelos) => {
    /*
    Controlador genérico para borrar varios modelos de la cache
        Parametros:
        modelos: Array de modelos a eliminar de la cache
    */
   modelos.forEach(async (modelo) => {
       console.log(`Eliminando cache de ${modelo.modelName}s`);
       await deleteModelsCache(modelo);
   });
};
module.exports = { getModelByIdCache, getModelsCache, deleteModelsCache, deleteModelByIdCache,  deleteManyModelsCache };