const { mongoose } = require("../config/db");
const { Schema } = require("mongoose");

const tagSchema = new mongoose.Schema(
  {
    tag: {
        type: Schema.Types.String,
        required: [true, 'El tag es obligatorio'],
        unique: [true, 'El tag ya se encuentra registrado'],
        minlength: [1, 'El tag debe tener al menos 1 carácter'],
    }
  },
  {
    collection: "tags",
  }
);

// Campo virtual para poblar los posts relacionados
tagSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'tags'
});

tagSchema.set("toJSON", {
  virtuals: true,
  transform: (_, ret) => {
    delete ret.__v;
    delete ret._id;
  },
});

const Tag = mongoose.model("Tag", tagSchema);
module.exports = Tag;