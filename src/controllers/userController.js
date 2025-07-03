const { User, Post, Comment } = require("../models");

const getUsers = async (_, res) => {
    const users = await User.find().populate({ path: 'posts', select: 'fecha content comments tags imagenes'}).populate({ path: 'comments', select: 'fecha content'});
    res.status(200).json(users);
};

const getUserById = async (req, res) => {
    const user = await User.findById(req.params.id).populate('posts').populate('comments');
    res.status(200).json(user);
};

const createUser = async (req, res) => {
    const user = await User.create(req.body);
    res.status(201).json(user);
};

const updateUserById = async (req, res) => {
    await User.findByIdAndUpdate(req.params.id, req.body, {new: true})
    res.status(200).json({ message: "Usuario actualizado correctamente" }); 
};

const deleteById = async (req, res) => {
    const userId = req.params.id;
    
    //Borrar los posts y comentarios del usuario
    await Post.deleteMany({ userId: userId });
    await Comment.deleteMany({ userId: userId });
    
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "Usuario eliminado correctamente" });
};

module.exports = { getUsers, getUserById, createUser, updateUserById, deleteById };