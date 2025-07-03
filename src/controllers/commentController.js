const {Comment, Post, User} = require('../models');
require('dotenv').config();

//Obtener todos los comentarios -> getComments
const getComments = async (_, res) => {
    const rangoMeses = parseInt(process.env.RANGO_VISIBILIDAD) || 6;
    const fechaLimite = new Date();
    fechaLimite.setMonth(fechaLimite.getMonth() - rangoMeses);

    // Buscar comentarios dentro del rango de fechas usando el campo 'fecha'
    const comments = await Comment.find({ fecha: { $gte: fechaLimite } });
    res.status(200).json(comments);
}

//Obtener un comentario por id -> getCommentById
const getCommentById = async (req, res) => {
    const commentId = req.params.id;
    const comment = await Comment.findById(commentId);
    res.status(200).json(comment);
};

//Obtener comentarios por userId -> getCommentsByUserId
const getCommentsByUserId = async (req, res) => {
    const userId = req.params.id;
    const comments = await Comment.find({ userId: userId }).populate('postId', 'content');
    res.status(200).json(comments);
}

//Crear un nuevo comentario con body-> createComment
const createComment = async (req, res) => {
    const comment = await Comment.create(req.body);
    
    //Agregar el comentario al post
    await Post.findByIdAndUpdate(req.body.postId, {
        $push: { comments: comment._id }
    });
    
    //Agregar el comentario al usuario
    await User.findByIdAndUpdate(req.body.userId, {
        $push: { comments: comment._id }
    });
    
    res.status(201).json({
        message: 'Comentario creado',
        comment
    });
}

//Actualizar un comentario por id -> updateComment
const updateComment = async (req,res) => {
    const updatedComment = await Comment.findByIdAndUpdate(req.params.id, req.body, {new: true});
    res.status(200).json({
        message: 'Comentario actualizado',
        comment: updatedComment
    });
}

//Borrar un comentario por id -> deleteComment
const deleteComment = async (req, res) => {
    const commentId = req.params.id;
    const deletedComment = await Comment.findByIdAndDelete(commentId);
    
    //Eliminar comentario de los modelos padres
    await User.updateMany({}, { $pull: { comments: commentId } });
    await Post.updateMany({}, { $pull: { comments: commentId } });
    
    res.status(200).json({
        message: 'Comentario eliminado',
        deletedComment
    });
}

module.exports = {
    getComments,
    getCommentById,
    createComment,
    updateComment,
    deleteComment,
    getCommentsByUserId  
}