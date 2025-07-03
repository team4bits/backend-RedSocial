const { Post, User, Tag, Archive } = require('../models');
const { errorPersonalizado } = require('./genericMiddleware');

const userDoesntChange = (req, res, next) => {
    if (req.body.userId !== undefined) {
        return errorPersonalizado("No se puede modificar el userId de un post", 400, next);
    }
    next();
}

const validarImagenAsociadaAPost = async (req, res, next) => {
    try {
        const { id, postId } = req.params;
        const imagen = await Archive.findOne({
            _id: id,
            postId: postId
        });
        if (!imagen) {
            console.log("imagen", imagen);
            return errorPersonalizado(`No se encuentra asociado el archivo con id ${id}, al post con id ${postId}.`, 404, next);
        }
        next();
    } catch (err) {
        next(err);
    }
}

const existsPostYTagPorId = async (req, res, next) => {
    try{
        const {postId, tagId} = req.params;

        const postToUpdate = await Post.findById(postId);
        const tagToUpdate = await Tag.findById(tagId);

        if (!postToUpdate || !tagToUpdate) {
            let modelo = !postToUpdate ? "Post" : "Tag";
            return errorPersonalizado(`${modelo} no encontrado` , 404, next);
        }
        next();
     } catch (error) {
        next(error);
    }
};

const tagOrCommentDontExists = (req, res, next) => {
    if (req.body.tags !== undefined || req.body.comments !== undefined) {
        return errorPersonalizado("No se pueden agregar tag o comment al crear un user", 400, next);
    }
    next();
}

module.exports = { userDoesntChange, existsPostYTagPorId, validarImagenAsociadaAPost, tagOrCommentDontExists };