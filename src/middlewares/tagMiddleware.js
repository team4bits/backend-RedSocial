const { Tag } = require('../models');

const {errorPersonalizado} = require('./genericMiddleware');

const notExistsTag = async (req, res, next) => {
    try {
        const tagByDescripcion = await Tag.findOne({ tag: req.body.tag  });
        if (tagByDescripcion) {
            return errorPersonalizado(`El tag ${ req.body.tag } ya se encuentra registrado`, 400, next);
        }    
    } catch (error) {
        next(error);
    }
    next();
};

const postDoesntExists = (req, res, next) => {
    if (req.body.posts !== undefined) {
        return errorPersonalizado("No se pueden agregar post al crear un tag", 400, next);
    }
    next();
}

module.exports = { notExistsTag, postDoesntExists };
