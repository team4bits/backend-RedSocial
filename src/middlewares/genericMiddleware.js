const multer = require('multer');
const { redisClient } = require('../config/redisClient');
const logRequest = (req, _, next) => {
    console.log({ method: req.method, url: req.url, fechaHora: new Date(), body: req.body, params: req.params });
    next();
};


const existsModelById = (modelo) => {
    return async (req, res, next) => {
        try {
            const id = req.params.id;
            const cached = await redisClient.get(`${modelo.modelName}:${id}`);
            if (!cached) {
                const data = await modelo.findById(id);
                if (!data) {
                    return errorPersonalizado(`${modelo.modelName} con id ${id} no se encuentra registrado en la base de datos` , 404, next);
                }
            }
        } catch (error) {
            next(error);
        }
        next();
    };
};

const existsAnyByModel = (modelo) => {
    return async (req, res, next) => {
        try {
            const data = await modelo.findOne();
            if (!data) {
                return errorPersonalizado(`No hay ningun ${modelo.name} registrado`, 204, next);
            }
        } catch (error) {
            next(error);
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

const validarCamposExactos = (modelo) => {
    return ( req, res, next ) => {
    const camposValidos = Object.keys(modelo.schema.paths);
    const camposRecibidos = Object.keys(req.body);
    const camposInvalidos = camposRecibidos.filter(campo => !camposValidos.includes(campo));

    if (camposInvalidos.length > 0) {
        return errorPersonalizado(`hay campos inválidos`, 400, next);
    }
    next()
    }
}





module.exports = { logRequest, existsModelById, existsAnyByModel, manejoDeErroresGlobales, errorPersonalizado, validarCamposExactos };