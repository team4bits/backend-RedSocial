const { Post, Comment, Archive, Tag, User } = require("../models");

const getPosts = async (_, res) => {
    const posts = await Post.find().populate('comments').populate('tags').populate('imagenes');
    res.status(200).json(posts);
};

const getPostById = async (req, res) => {
    const post = await Post.findById(req.params.id).populate({ path: 'comments', select: 'userId content fecha -_id' }).populate({ path: 'tags', select: 'tag -_id' });
    res.status(200).json(post);
};

const getPostsByUserId = async (req, res) => {
    const userId = req.params.id;
    const posts = await Post.find({ userId: userId })
        .populate({
            path: 'comments',
            populate: { path: 'userId', select: 'nickName email' }
        })
        .populate('tags')
        .populate('imagenes');

    res.status(200).json(posts);
};

const createPost = async (req, res) => {
    const post = await Post.create(req.body);
    const { userId } = req.body;
    await User.findByIdAndUpdate(userId, { $push: { posts: post._id } }, { new: true });
    res.status(201).json(post);
};

const updatePostById = async (req, res) => {
    await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ message: "Post actualizado correctamente" });
};

const deletePostById = async (req, res) => {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    
    // Borrar los comentarios, archivos y tags del post
    await Comment.deleteMany({ postId: postId });
    await Archive.deleteMany({ postId: postId });
    await Tag.updateMany({ posts: postId }, { $pull: { posts: postId } });
    
    await Post.findByIdAndDelete(postId);
    
    // Borrar el post del usuario que lo creó
    await User.findByIdAndUpdate(
        post.userId,
        {
            $pull: {
                posts: postId,
                comments: { $in: post.comments }
            }
        }
    );
    
    res.status(200).json({ message: "Post eliminado correctamente" });
};

const actualizarTag = (metodo) => {
    return async (req, res) => {
        if (metodo == "agregar") {
            await Post.findByIdAndUpdate(req.params.postId, { $push: { tags: req.params.tagId } }, { new: true });
            await Tag.findByIdAndUpdate(req.params.tagId, { $push: { posts: req.params.postId } }, { new: true });
        } else {
            await Post.findByIdAndUpdate(req.params.postId, { $pull: { tags: req.params.tagId } }, { new: true });
            await Tag.findByIdAndUpdate(req.params.tagId, { $pull: { posts: req.params.postId } }, { new: true });
        }
        res.status(200).json({ message: `Tag ${metodo == "agregar" ? "agregado" : "eliminado"} correctamente` });
    }
};

module.exports = { getPosts, getPostById, createPost, updatePostById, deletePostById, actualizarTag, getPostsByUserId };