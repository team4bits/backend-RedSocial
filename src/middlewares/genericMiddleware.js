const multer = require('multer');
const { redisClient } = require('../config/redisClient');
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
        try {
            const id = req.params.id;
            const cached = await redisClient.get(`${modelo.name}:${id}`);
            if (!cached) {
                const data = await modelo.findById(id);
                if (!data) {
                    return res
                        .status(404)
                        .json({ message: `${modelo.name} con id ${id} no se encuentra registrado en la base de datos` });
                }
            }
        } catch (error) {
            return status500(res, error);
        }
        next();
    };
};

const existsAnyByModel = (modelo) => {
    return async (req, res, next) => {
        try {
            const data = await modelo.findOne();
            if (!data) {
                return res
                    .status(204)
                    .json({ message: `No hay ningun ${modelo.name} registrado` });
            }
        } catch (error) {
            return status500(res, error);
        }
        next();
    }
};

const errorPersonalizado = (message, status, next) => {
    const err = new Error(message);
    err.status = status;
    return next(err);
};

const manejoDeErroresGlobales = ((err, req, res, next) => {        
    //console.error(err);            // Descomentar para Debugging
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(e => e.message); //Extraes SOLO los mensajes de errores de validación moongose (del modelo)
        return res.status(400).json({ error: messages });
    }
    if (err instanceof multer.MulterError) {       
        if (err.code === 'LIMIT_FILE_SIZE') {return res.status(400).json({ error: 'La imagen excede el tamaño máximo permitido de 5MB' })}
        //if (err.code === 'LIMIT_UNEXPECTED_FILE') { return res.status(400).json({ error: err.message || 'Tipo de archivo no permitido' })} no lo puedo hacer andar
        return res.status(400).json({ error: err.message });
    }
    if (err.status) {
        return res.status(err.status).json({ error: err.message });  //Retorna el error con el status y mensaje que se le envié por middleware o controlador
    }
    res.status(500).json({ error: 'Error interno del servidor' });  //
});

module.exports = { logRequest, existsModelById, status500, existsAnyByModel, manejoDeErroresGlobales, errorPersonalizado };