const { mongoose } = require("../config/db");
const { Schema } = require("mongoose");

const commentSchema = new mongoose.Schema(
    {
        postId: {
            type: Schema.Types.ObjectId,
            ref: "Post",
            required: [true, "El ID del post es obligatorio"]
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "El ID del usuario es obligatorio"]
        },
        content: {
            type: Schema.Types.String,
            required: [true, "El contenido del comentario es obligatorio"],
            minlength: [5, "El contenido del comentario debe tener al menos 5 caracteres"],
            maxlength: [500, "El contenido del comentario no puede exceder los 500 caracteres"]
        },
        fecha: {
            type: Schema.Types.Date,
            default: Date.now
        }
    }
);
commentSchema.set("toJson", {
    transform: (_, ret) => {
        delete ret.__v; // Eliminar el campo __v
        //delete ret._id; // Eliminar el campo _id
    }
});
const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;