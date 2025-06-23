const { redisClient } = require('../config/redisClient');

const getModelByIdCache = async (modelo, id) => {
    const model = await redisClient.get(`${modelo.modelName}:${id}`);
    console.log(model ? "Modelo cacheado" : `No hay cache para ${modelo.modelName}`);
    return model;
};

const getModelsCache = async (modelo) => {
    const models = await redisClient.get(`${modelo.modelName}s:todos`);
    console.log(models ? "Modelo cacheado" : `No hay cache para ${modelo.modelName}s`);
    return models;
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
//Controlador genérico para borrar varios de un modelo en la db
const deleteManyDbParents = async (modelos, queryObject) => {
    /*
        Contolador genérico para borrar varios modelos de la base de datos
        Parametros:
        modelos: Array de modelos a eliminar de la base de datos
        queryObject: Objeto de consulta para filtrar los documentos a eliminar

    */
    modelos.forEach(async (modelo) => {
        console.log(`Eliminando ${modelo.modelName}s con query:`, queryObject);
        await modelo.updateMany(
            queryObject,
            { $pull: queryObject }
        )
    })
}
//Controlador genérico para eliminar varios hijos de un modelo en la db
const deleteManyDbChildren = async (modelos, queryObject) => {
    /*
        Contolador genérico para eliminar varios modelos de la base de datos
        Parametros:
        modelos: Array de modelos a eliminar de la base de datos
        queryObject: Objeto de consulta para filtrar los documentos a eliminar

    */
    modelos.forEach(async (modelo) => {
        console.log(`Eliminando ${modelo.modelName}s con query:`, queryObject);
        await modelo.deleteMany(queryObject)
    })
}
module.exports = { getModelByIdCache, getModelsCache, deleteModelsCache, deleteModelByIdCache,  deleteManyModelsCache, deleteManyDbParents, deleteManyDbChildren };