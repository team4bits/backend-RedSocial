const { Post, Comment, Archive, Tag, User } = require("../models");
const { redisClient }  = require('../config/redisClient')
const { getModelByIdCache, getModelsCache, deleteModelsCache, deleteModelByIdCache } = require("./genericController")

const getPosts = async (_, res) => {
    const cached = await getModelsCache(Post)
    const posts = cached ? JSON.parse(cached) : await Post.find();
    await redisClient.set('posts:todos', JSON.stringify(posts), { EX: 300 })
    res.status(200).json(posts);
};

const getPostById = async (req, res) => {
    const cached = getModelByIdCache(Post, req.params.id)   //Intenta obtener el post del cache
    const post = cached ? JSON.parse(cached) : await Post.findById(req.params.id);  //Si no está en el cache, lo busca en la base de datos
    await redisClient.set(`post:${req.params.id}`, JSON.stringify(post), { EX: 300 })  // Guarda el post en el cache con una expiración de 300 segundos
    res.status(200).json(post);
};

const createPost = async (req, res) => {
    const post = await Post.create(req.body);
    //Agrega el id del post al array de post del usuario
    await User.findByIdAndUpdate(req.body.userId, { $push: { posts: post._id } });
    deleteModelsCache(Post) // Elimina el cache de todos los posts, ya que se ha creado uno nuevo por ende el cache esta desactualizado
    res.status(201).json(post);
};

const updatePostById = async (req, res) => {
    await Post.findByIdAndUpdate(req.params.id, req.body, {new: true})
    deleteModelByIdCache(Post, req.params.id) 
    deleteModelsCache(Post) // Borro ambos caches, el de un post en particular y el de todos los posts para garantizar que la información sea borrada
    res.status(200).json({ message: "Post actualizado correctamente" }); 
};

const deletePostById = async (req, res) => {
    const postId = req.params.id;
    await Archive.deleteMany({ post: postId });
    await Comment.deleteMany({ post: postId });
    await Tag.deleteMany({ post: postId });
    await Post.findByIdAndDelete(postId);
    deleteModelByIdCache(Post, postId);
    deleteModelsCache(Post); // Lo mismo que en update
    res.status(200).json({ message: "Post eliminado correctamente" });
};

module.exports = { getPosts, getPostById, createPost, updatePostById, deletePostById };