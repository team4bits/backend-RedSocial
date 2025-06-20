const {Comment, Post, User} = require('../models');

const {redisClient} = require('../config/redisClient')

//Importar controladores de cache
const {deleteModelsCache, deleteModelByIdCache, getModelsCache, getModelByIdCache} = require('./genericController');


//Obtener todos los comentarios -> getComments
const getComments = async (_,res) => {
    //Guardar la cacheKey
    const cached = await getModelsCache(Comment);
    const comments = cached ? JSON.parse(cached) : await Comment.find();
    //Guardar los comentarios en la cache con la key: comments:todos
    await redisClient.set('comments:todos', JSON.stringify(comments), {EX: 300});
    //Retornar los comentarios
    res.status(200).json(comments);
    
}
//Obtener un comentario por id -> getCommentById
const getCommentById = async (req, res) => {
    /*
        Obtener un comentario por id
        req.params.id -> id del comentario
        Guardar el comentario en la cache con la key: comment:<commentId>
    */
    const commentId = req.params.id;//Obtiene el id del comentario
    const cached = await getModelByIdCache(Comment, commentId);//Obtiene el comentario de la cache
    //Si está cacheado, lo asigna a comment, sinó lo busca en la base de datos
    const comment = cached ? JSON.parse(cached) : await Comment.findById(commentId);
    //Guardar el comentario en la cache con la key: comment:commentId
    await redisClient.set(`comment:${commentId}`, JSON.stringify(comment), { EX: 300 });
    res.status(200).json(comment);
};
//Obtener todos los comentarios de un post -> getPostComments No probado
const getPostComments = async (req, res) => {
    /*
        Obtener todos los comentarios de un post
        req.params.id -> id del post
        Guardar los comentarios en la cache con la key: comments:<postId>
    */
    const postId = req.params.id;
    const cacheKey = `comments:${postId}`
    try {
        const cached = await redisClient.get(cacheKey);
        if(cached){
            //Retornar los comentarios guardados en la cache
            return res.status(200).json(JSON.parse(cached));
        }
        //Obtener ls comentarios guardados en la db
        const comments = await Post.find({post: postId});
        //Guardar los comentarios en la cache
        await redisClient.set(cacheKey, JSON.stringify(comments), {EX: 300});
        //Retornar los comentarios
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}
//Crear un nuevo comentario con body-> createComment
const createComment = async (req, res) => {
    const comment = await Comment.create(req.body);//Crear el comentario
    //Agregar el comentario al post
    await Post.findByIdAndUpdate(req.body.postId, {
        $push: { comments: comment._id }
    });
    //Agregar el comentario al usuario
    await User.findByIdAndUpdate(req.body.userId, {
        $push: { comments: comment._id }
    });
    //Guardar el comentario en la cache con la key: comment:<commentId>
    await redisClient.set(`comment:${comment._id}`, JSON.stringify(comment), { EX: 300 });
    //Eliminar los comentarios de la cache
    //Esto es necesario para que al crear un comentario, se actualicen los comentarios en la cache
    deleteModelsCache(Comment);
    res.status(201).json({
        message: 'Comentario creado',
        comment
    });
}

//Actualizar un comentario por id -> updateComment
const updateComment = async (req,res) => {
    /*
        req.params.id -> id del comentario
        req.body -> datos a actualizar
    */
    await Comment.findByIdAndUpdate(req.params.id, req.body, {new: true})
    //Eliminar el comentario de la cache
    deleteModelByIdCache(Comment, req.params.id);
    //Retornar el comentario actualizado
    const updatedComment = await Comment.findById(req.params.id);
    res.status(200).json({
        message: 'Comentario actualizado',
        comment: updatedComment
    });
}
//Borrar un comentario por id -> deleteComment
const deleteComment = async (req, res) => {
    /*
        Borrar un comentario por id
        req.params.id -> id del comentario
        Eliminar el comentario de la cache con la key: comment:<commentId>
    */
    const commentId = req.params.id;
    //El middelware verificó que el comenario existe
    const deletedComment = await Comment.findByIdAndDelete(commentId);
    //Eliminar el comentario de la cache
    deleteModelByIdCache(Comment, commentId);
    //Retornar el comentario eliminado
    res.status(200).json({
        message: 'Comentario eliminado',
        deletedComment
    });
    
}

module.exports ={
    getComments,
    getPostComments,
    getCommentById,
    createComment,
    createCommentWithParams,
    updateComment,
    deleteComment
}