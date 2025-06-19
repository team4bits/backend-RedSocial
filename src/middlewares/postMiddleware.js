const { Post, User } = require('../models');
const { errorPersonalizado } = require('./genericMiddleware');

const existUserRequest = async (req, res, next) => {
    try {
        const userId = req.body.userId;
        if (!userId) {
            return errorPersonalizado("El ID del usuario es requerido", 400, next);
        }
        if (!/^[a-fA-F0-9]{24}$/.test(userId)) {
            return errorPersonalizado("El ID del usuario debe ser una cadena de strings de 24 caracteres hexadecimales", 400, next);
        }
        const user = await User.findById(userId);
        if (!user) {
            return errorPersonalizado(`Usuario con ID ${userId} no encontrado`, 404, next);
        }
        next();
    } catch (error) {
        next(error);
    }
};

const userDoesntChange = (req, res, next) => {
    if (req.body.userId !== undefined) {
        return errorPersonalizado("No se puede modificar el userId de un post", 400, next);
    }
    next();
}

// const validarImagenAsociadaAPost = async (req,res,next) => {
//     try{
//         const {id,idImage} = req.params;
//         const imagen = await Archive.findOne({where:{
//                                                     "id":idImage,
//                                                     "postId":id}});
//         if (!imagen) {
//             return res.status(404).send(`Error: No se encuentra asociado el archivo con id ${idImage}, al post con id ${id}.`)
//         }
//         next();
//     }catch(err){
//         return status500(res,error);
//     }
// }

// const existsModelImageById = async (req, res, next) => {
//         try{
//             const id = req.params.idImage;
//             const data = await Archive.findByPk(id);
//             if (!data) {
//                 return res
//                     .status(404)
//                     .json({ message: `Archivo con id ${id} no se encuentra registrado` });
//             }
//         }
//         catch (error) {
//             return status500(res,error);
//         }
//         next();
//     };

// const existsPostYTagPorId = async (req, res, next) => {
//         try{
//             const {postId, tagId} = req.params;
//             const postToUpdate = await Post.findByPk(postId);
//             const tagToUpdate = await Tag.findByPk(tagId);
//             if (!postToUpdate || !tagToUpdate) {
//             let modelo = !postToUpdate ? "Post" : "Tag";
//             return res.status(404).json({ error: `${modelo} no encontrado` });
//             }
//         } catch (error) {
//             return status500(res,error);
//         }
//         next();
//     };



module.exports = { existUserRequest, userDoesntChange };