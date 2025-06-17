const {Comment, Post} = require('../models');

const redisClient = require('../config/redisClient')


//Obtener todos los comentarios -> getComments
const getComments = async (_,res) => {
    //Guardar la cacheKey
    const cacheKey = 'comment:list'
    try {
        //obtener los comentarios guardados en cache
        const cached = await redisClient.get(cacheKey)
        if(cached){//Si hay guardado
            //Retornar lo guardado
            return res.status(200).json(JSON.parse(cached))
        }
        //Obtener los comentarios buardados en la db
        const comments = await Comment.find()
        await redisClient.set(cacheKey, JSON.stringify(comments), {EX: 300})
        res.status(200).json(comments)
    } catch (error) {
        //Retornar error
        res.status(500).json({error: error.message})
    }
    return ;
}
//Obtener todos los comentarios de un post -> getPostComments
const getPostComments = async (req, res) => {
    //Obtener el id del post
    const postId = req.params.postId;
    const cacheKey = `comments:${postId}`
    try {
        const cached = await redisClient.get(cacheKey);
        if(cached){
            //Retornar los comentarios guardados en la cache
            return res.status(200).json(JSON.parse(cached));
        }
        //Obtener ls comentarios guardados en la db
        const comments = await Post.find({post: postId});
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({error: error.message})
    }
    return;
}
//Crear un nuevo comentario -> createComment
const createComment = async (req, res) => {
    return ;
}
//Actualizar un comentario por id -> updateComment
const updateComment = async (req,res) => {
    return ;
}
//Borrar un comentario por id -> deleteComment
const deleteComment = async (req, res) => {
    return;
}

module.exports ={
    getComments,
    getPostComments,
    createComment,
    updateComment,
    deleteComment
}