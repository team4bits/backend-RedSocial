const { mongoose } = require("../config/db");
const { Schema } = require("mongoose");

const postSchema = new mongoose.Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'El userId es obligatorio'],
        },
        content: {
            type: Schema.Types.String,
            required: [true, 'El contenido es obligatorio'],
            minlength: [5, 'El contenido debe tener al menos 5 carácter'],
            maxlength: [500, 'El contenido no puede exceder los 500 caracteres'],
        },
        fecha: {
            type: Schema.Types.Date,
            default: Date.now,
        },
        imagenes: [{
            type: Schema.Types.ObjectId,
            ref: 'Archive',
        }],
        comments: [{
                type: Schema.Types.ObjectId,
                ref: 'Comment'
            }],
        tags:[{
            type: Schema.Types.ObjectId,
            ref: 'Tag'
        }]
    },
    {
        collection: "posts",
    }
);

postSchema.set("toJSON", {
    transform: (_, ret) => {
        delete ret.__v;
        //delete ret._id;
    },
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;