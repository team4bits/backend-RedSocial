const { mongoose } = require("../config/db");
const { Schema } = require("mongoose");

const tagSchema = new mongoose.Schema(
  {
    nameTag: {
        type: Schema.Types.String,
        required: [true, 'El nombre del tag es obligatorio'],
        unique: [true, 'El nombre del tag ya se encuentra registrado'],
        minlength: [1, 'El nombre del tag debe tener al menos 1 carácter'],
    },
    posts:[{
                type: Schema.Types.ObjectId,
                ref: 'Post'
    }]
  },
  {
    collection: "tags",
  }
);

tagSchema.set("toJSON", {
  transform: (_, ret) => {
    delete ret.__v;
    //delete ret._id;
  },
});

const Tag = mongoose.model("Tag", tagSchema);
module.exports = Tag;