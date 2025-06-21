const { mongoose } = require("../config/db");
const { Schema } = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    nickName: {
        type: Schema.Types.String,
        required: [true, 'El nickName es obligatorio'],
        unique: [true, 'El nickName ya se encuentra registrado'],
        minlength: [2, 'El nickName debe tener al menos 2 caracteres'],
    },
    email: {
        type: Schema.Types.String,
        required: [true, 'El email es obligatorio'],
        unique: [true, 'El email ya se encuentra registrado'],
    },
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }]
  },
  {
    collection: "users",
  }
);

userSchema.set("toJSON", {
  transform: (_, ret) => {
    delete ret.__v;
    //delete ret._id;
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;