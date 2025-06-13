const { User } = require('../models');

const { status500 } = require("./genericMiddleware")

const notExistsUser= async (req, res, next) => {
    try {
        const userByNickName = await User.findOne({ nickName: req.body.nickName });
        const userByEmail = await User.findOne({ email: req.body.email  });
        if (userByNickName || userByEmail ) {
            let atributo = userByNickName ? `nickName ${ req.body.nickName }` : `email ${ req.body.email }`;
            return res
                .status(400)
                .json({ message: `El ${ atributo } ya se encuentra registrado` });
        }    
    } catch (error) {
        return status500(res, error);
    }
    next();
};
  
module.exports = { notExistsUser };