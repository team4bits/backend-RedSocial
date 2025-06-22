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

module.exports = { notExistsTag };
