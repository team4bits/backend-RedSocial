const { User } = require('../models');

const { errorPersonalizado } = require('./genericMiddleware');

const notExistsUser= async (req, res, next) => {
    try {
        const userByNickName = await User.findOne({ nickName: req.body.nickName });
        const userByEmail = await User.findOne({ email: req.body.email  });
        if (userByNickName || userByEmail ) {
            let atributo = userByNickName ? `nickName ${ req.body.nickName }` : `email ${ req.body.email }`;
            return errorPersonalizado(`El ${ atributo } ya se encuentra registrado`, 400, next);
        }    
    } catch (error) {
        next(error);
    }
    next();
};
  
const postOrCommentDontExists = (req, res, next) => {
    if (req.body.posts !== undefined || req.body.comments !== undefined) {
        return errorPersonalizado("No se pueden agregar post o comment al crear un user", 400, next);
    }
    next();
}

module.exports = { notExistsUser, postOrCommentDontExists };