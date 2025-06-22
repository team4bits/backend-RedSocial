const Archive = require("../models/archive");
const Post = require("../models/post");
const { getModelsCache } = require("./genericController");
const { redisClient } = require('../config/redisClient');


const getArchives = async (req, res) => {
  const cached = await getModelsCache(Archive);
  const archives = cached ? JSON.parse(cached) : await Archive.find();
  await redisClient.set('Archives:todos', JSON.stringify(archives), { EX: 300 });
  res.status(200).json(archives);
};

const createArchives = async (req, res) => {
  try {
    const { postId } = req.body;
    const archivos = req.files;
    if (!archivos || archivos.length === 0) {
      return res.status(400).json({ error: 'No se subieron imágenes' });
    }
    const nuevasEntradas = await Promise.all(
      archivos.map(file =>
        Archive.create({
          imagen: `/uploads/${file.filename}`,
          postId,
        })
      )
    );

    // Agrega las referencias de los archivos al post
    const archiveIds = nuevasEntradas.map(entry => entry._id);
    await Post.findByIdAndUpdate(postId, { $push: { imagenes: { $each: archiveIds } } });

    await redisClient.sendCommand(['DEL', 'archives:todos']);
    //await redisClient.del('archives_all'); // version vieja de redis
    res.status(201).json(nuevasEntradas);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

///FALTA
const updateArchive = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'El campo "imagenes" es obligatorio' });
  }

  try {
    req.archive.imagen = `/uploads/${req.file.filename}`;
    await req.archive.save();
    //REDIS - ELIMINAR CACHE
    await redisClient.del('archives_all');

    res.status(200).json(req.archive);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

const deleteById = async (req, res) => {
  try {
    const archive = await Archive.findById(req.params.id);
    if (!archive) {
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }
    await archive.deleteOne();

    // Eliminar la referencia del archivo en el post
    await Post.findByIdAndUpdate(
      archive.postId,
      { $pull: { imagenes: archive._id } }
    );

    //REDIS - ELIMINAR CACHE
    await redisClient.del('archives_all');

    res.status(200).json({ message: 'Archivo eliminado correctamente' });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

module.exports = {
  getArchives,
  //createArchive,
  createArchives,
  updateArchive, deleteById
};


/*
// Crear un solo archivo (con imagen pasada por body, no multer)
const createArchive = async (req, res) => {
try {
 const postId = req.params.id;
 const { imagen } = req.body;

 const newArchive = await Archive.create({
   imagen,
   postId,
 });
 //REDIS - ELIMINAR CACHE
 await redisClient.del('archives_all');

 res.status(201).json(newArchive);
} catch (e) {
 res.status(400).json({ error: e.message });
}
};
*/