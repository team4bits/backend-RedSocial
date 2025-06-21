const { Post, Comment, Archive, Tag, User } = require("../models");
const { redisClient } = require('../config/redisClient')
const { getModelByIdCache, getModelsCache, deleteModelsCache, deleteModelByIdCache } = require("./genericController")

const getPosts = async (_, res) => {
    const cached = await getModelsCache(Post)
    const posts = cached ? JSON.parse(cached) : await Post.find().populate({ path:'comments', select: 'userId content fecha -_id'}).populate({ path: 'tags', select: 'tag -_id' }); // Intenta obtener los posts del cache, si no están, los busca en la base de datos
    await redisClient.set('posts:todos', JSON.stringify(posts), { EX: 300 })
    res.status(200).json(posts);
};

const getPostById = async (req, res) => {
    const cached = await getModelByIdCache(Post, req.params.id)   //Intenta obtener el post del cache
    const post = cached ? JSON.parse(cached) : await Post.findById(req.params.id).populate({ path:'comments', select: 'userId content fecha -_id'}).populate({ path: 'tags', select: 'tag -_id' });  //Si no está en el cache, lo busca en la base de datos
    await redisClient.set(`post:${req.params.id}`, JSON.stringify(post), { EX: 300 })  // Guarda el post en el cache con una expiración de 300 segundos
    res.status(200).json(post);
};

const createPost = async (req, res) => {
    const post = await Post.create(req.body);
    const { userId } = req.body;
    await User.findByIdAndUpdate(userId, { $push: { posts: post._id } }, { new: true }); // Agrega el post al usuario
    await deleteModelsCache(Post) // Elimina el cache de todos los posts, ya que se ha creado uno nuevo por ende el cache esta desactualizado
    res.status(201).json(post);
};

const updatePostById = async (req, res) => {
    await Post.findByIdAndUpdate(req.params.id, req.body, { new: true })
    await deleteModelByIdCache(Post, req.params.id)
    await deleteModelsCache(Post) // Borro ambos caches, el de un post en particular y el de todos los posts para garantizar que la información sea borrada
    res.status(200).json({ message: "Post actualizado correctamente" });
};

const deletePostById = async (req, res) => {
    const postId = req.params.id;
    await Archive.deleteMany({ postId: postId });
    await Comment.deleteMany({ postId: postId });
    await Tag.deleteMany({ postId: postId });
    await Post.findByIdAndDelete(postId);
    await deleteModelByIdCache(Post, postId);
    await deleteModelsCache(Post); // Lo mismo que en update
    res.status(200).json({ message: "Post eliminado correctamente" });
};

const actualizarTag = (metodo) => {
    return async (req, res) => {  
            if (metodo == "agregar"){
                await Post.findByIdAndUpdate(req.params.postId, { $push: { tags: req.params.tagId } }, { new: true });
                await Tag.findByIdAndUpdate(req.params.tagId, { $push: { posts: req.params.postId } }, { new: true });
            } else {
                await Post.findByIdAndUpdate(req.params.postId, { $pull: { tags: req.params.tagId } }, { new: true });
                await Tag.findByIdAndUpdate(req.params.tagId, { $pull: { posts: req.params.postId } }, { new: true });
            }
            await deleteModelByIdCache(Post, req.params.id) 
            await deleteModelsCache(Post)
            res.status(200).json({ message: `Tag ${metodo == "agregar" ? "agregado" : "eliminado"} correctamente` });
        
    }
}

module.exports = { getPosts, getPostById, createPost, updatePostById, deletePostById, actualizarTag };
