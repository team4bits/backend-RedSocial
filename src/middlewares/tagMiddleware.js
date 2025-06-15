const { Tag } = require('../models');

const { status500 } = require("./genericMiddleware")

const notExistsTag = async (req, res, next) => {
    try {
        const tagByDescripcion = await Tag.findOne({ tag: req.body.tag  });
        if (tagByDescripcion) {
            return res
                .status(400)
                .json({ message: `El tag ${ req.body.tag } ya se encuentra registrado` });
        }    
    } catch (error) {
        return status500(res, error);
    }
    next();
};

module.exports = { notExistsTag };
