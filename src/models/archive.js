const { mongoose } = require("../config/db");
const { Schema } = mongoose;

const archiveSchema = new Schema(
  {
    imagen: {
      type: String,
      required: [true, 'La imagen es obligatoria'],
      unique: true,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      //required: [true, 'El post asociado es obligatorio'],
    }
  },
  {
    collection: "archives",
    //timestamps: false, // ver si hace falta
  }
);

archiveSchema.set("toJSON", {
  transform: (_, ret) => {
    delete ret.__v;
    //delete ret._id;
  },
});

const Archive = mongoose.model("Archive", archiveSchema);
module.exports = Archive;