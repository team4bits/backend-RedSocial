const { Tag, Post } = require("../models");

const getTags = async (_, res) => {
    const tags = await Tag.find().populate({ path: 'posts', select: 'fecha content userId' });
    res.status(200).json(tags);
};

const getTagById = async (req, res) => {
    const tag = await Tag.findById(req.params.id).populate('posts');
    res.status(200).json(tag);
};

const createTag = async (req, res) => {
    const tag = await Tag.create(req.body);
    res.status(201).json(tag);
};

const updateTagById = async (req, res) => {
    await Tag.findByIdAndUpdate(req.params.id, req.body, {new: true})
    res.status(200).json({ message: "Tag actualizado correctamente" }); 
};

const deleteById = async (req, res) => {
    const tagId = req.params.id;
    
    // Eliminar el tag de todos los posts que lo referencian
    await Post.updateMany({ tags: tagId }, { $pull: { tags: tagId } });
    
    // Eliminar el tag
    await Tag.findByIdAndDelete(tagId);
    
    res.status(200).json({ message: "Tag eliminado correctamente" });
};

module.exports = { getTags, getTagById, createTag, updateTagById, deleteById };