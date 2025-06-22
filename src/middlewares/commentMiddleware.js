//Importar modelos de usuario y post
const {User, Post} = require('../models');
const { errorPersonalizado } = require('./genericMiddleware');

//Verificar que exista el post
const postVerify = async (req, res, next) => {
    const postId = req.params.postId;
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return errorPersonalizado('Post no encontrado', 404, next);
        }
        next();
    } catch (error) {
        next(error);
    }
};

//Verificar que exista el usuario
const userVerify = async (req, res, next) => {
    const userId = req.params.userId;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return errorPersonalizado('Usuario no encontrado', 404, next);
        }
        next();
    } catch (error) {
        next(error);
    }
};

//Verificar que exista el postId en el body
const postIdInBodyVerify = (req, res, next) => {
    if (!req.body.postId) {
        return errorPersonalizado('El campo postId es obligatorio en el body', 400, next);
    }
    next();
};
//Verificar que exista el userId en el body
const userIdInBodyVerify = (req, res, next) => {
    if (!req.body.userId) {
        return errorPersonalizado('El campo userId es obligatorio en el body', 400, next);
    }
    next();
};


//Exportar middlewares
module.exports = {
    postVerify,
    userVerify,
    postIdInBodyVerify,
    userIdInBodyVerify
};