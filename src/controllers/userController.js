const { User, Post, Comment } = require("../models");
const { redisClient }  = require('../config/redisClient')
const { getModelByIdCache, getModelsCache, deleteModelsCache, deleteModelByIdCache } = require("./genericController")

const getUsers = async (_, res) => {
    const cached = await getModelsCache(User)
    const users = cached ? JSON.parse(cached) : await User.find();
    await redisClient.set('users:todos', JSON.stringify(users), { EX: 300 })
    res.status(200).json(users);
};

const getUserById = async (req, res) => {
    const cached = getModelByIdCache(User, req.params.id)
    const user = cached ? JSON.parse(cached) : await User.findById(req.params.id);
    await redisClient.set(`user:${req.params.id}`, JSON.stringify(user), { EX: 300 })
    res.status(200).json(user);
};

const createUser = async (req, res) => {
    const user = await User.create(req.body);
    deleteModelsCache(User)
    res.status(201).json(user);
};

const updateUserById = async (req, res) => {
    await User.findByIdAndUpdate(req.params.id, req.body, {new: true})
    deleteModelByIdCache(User, req.params.id)
    deleteModelsCache(User)
    res.status(200).json({ message: "Usuario actualizado correctamente" }); 
};

const deleteById = async (req, res) => {
    const userId = req.params.id;
    await Post.deleteMany({ user: userId });
    await Comment.deleteMany({ user: userId });
    await User.findByIdAndDelete(userId);
    deleteModelByIdCache(User, userId);
    deleteModelsCache(User);
    res.status(200).json({ message: "Usuario eliminado correctamente" });
};

module.exports = { getUsers, getUserById, createUser, updateUserById, deleteById };