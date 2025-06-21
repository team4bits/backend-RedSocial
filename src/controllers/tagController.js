const { Tag } = require("../models");
const { redisClient }  = require('../config/redisClient')
const { getModelByIdCache, getModelsCache, deleteModelsCache, deleteModelByIdCache } = require("./genericController")

const getTags = async (_, res) => {
    const cached = await getModelsCache(Tag)
    const tags = cached ? JSON.parse(cached) : await Tag.find();
    await redisClient.set('tags:todos', JSON.stringify(tags), { EX: 300 })
    res.status(200).json(tags);
};

const getTagById = async (req, res) => {
    const cached = await getModelByIdCache(Tag, req.params.id)
    const tag = cached ? JSON.parse(cached) : await Tag.findById(req.params.id);
    await redisClient.set(`tag:${req.params.id}`, JSON.stringify(tag), { EX: 300 })
    res.status(200).json(tag);
};

const createTag = async (req, res) => {
    const tag = await Tag.create(req.body);
    await deleteModelsCache(Tag)
    res.status(201).json(tag);
};

const updateTagById = async (req, res) => {
    await Tag.findByIdAndUpdate(req.params.id, req.body, {new: true})
    await deleteModelByIdCache(Tag, req.params.id)
    await deleteModelsCache(Tag)
    res.status(200).json({ message: "Tag actualizado correctamente" }); 
};

const deleteById = async (req, res) => {
    const tagId = req.params.id;
    await Tag.findByIdAndDelete(tagId);
    await deleteModelByIdCache(Tag, tagId);
    await deleteModelsCache(Tag);
    res.status(200).json({ message: "Tag eliminado correctamente" });
};

module.exports = { getTags, getTagById, createTag, updateTagById, deleteById };