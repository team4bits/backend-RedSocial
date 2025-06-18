const {redisClient} = require('../config/redisClient');
const logRequest = (req, _, next) => {
    console.log({ method: req.method, url: req.url, fechaHora: new Date(), body: req.body, params: req.params });
    next();
};

const status500 = (res, error) => {
    console.log(error)
    return res
        .status(500)
        .json({ message: `Error interno del servidor` });
}

const existsModelById = (modelo) => {
    return async (req, res, next) => {
        try{
            const id = req.params.id;
            const cached = await redisClient.get(`${modelo.name}:${id}`);
            if(!cached){
                const data = await modelo.findById(id);
                if (!data) {
                    return res
                        .status(404)
                        .json({ message: `${ modelo.name } con id ${ id } no se encuentra registrado en la base de datos` });
                }
            }
        } catch (error) {
            return status500(res,error);
        }
        next();
    };
};

const existsAnyByModel = (modelo) => {
    return async (req, res, next) => {
        try {
            const data = await modelo.findOne();
            if (!data ) {
                return res
                    .status(204)
                    .json({ message: `No hay ningun ${ modelo.name } registrado` });
            }  
        } catch (error) {
            return status500(res, error);
        } 
        next();
    }
};

module.exports = { logRequest, existsModelById, status500, existsAnyByModel };