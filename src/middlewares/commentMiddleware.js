//Importar modelos de usuario y post
const {User, Post} = require('../models');


//Verificar que exista el post
const postVerify = async (req, res, next) => {
    const postId = req.params.postId;
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post no encontrado' });
        }
        next();
    } catch (error) {
        return res.status(500).json({ message: 'Error verificando el post', error });
    }
};

//Verificar que exista el usuario
const userVerify = async (req, res, next) => {
    const userId = req.params.userId;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        next();
    } catch (error) {
        return res.status(500).json({ message: 'Error verificando el usuario', error });
    }
};
//Exportar middlewares
module.exports = {
    postVerify,
    userVerify
};