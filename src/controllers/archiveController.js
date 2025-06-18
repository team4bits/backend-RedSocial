const Archive = require("../models/archive");
const redisClient = require('../config');

const getArchives = async (req, res) => {
  //console.log("entre")
  const cacheKey = 'archives_all'; // CACHE
  try {
    //REDIS
    const cache = await redisClient.get(cacheKey);
    if (cache){
      //console.log("REDIS")
      return res.status(200).json(JSON.parse(cache));
    }
    //MONGO
    const data = await Archive.find({});
    //console.log("MONGO")
    if (!data || data.length === 0) {
      return res.status(204).send();
    }
    //GUARDAR CACHE
    await redisClient.setEx(cacheKey, 120, JSON.stringify(data));

    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
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

const createArchives = async (req, res) => {
  try {
    const postId = req.params.id;
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
    //REDIS - ELIMINAR CACHE
    await redisClient.del('archives_all');

    res.status(201).json(nuevasEntradas);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

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
    //REDIS - ELIMINAR CACHE
    await redisClient.del('archives_all');

    res.status(200).json({ message: 'Archivo eliminado correctamente' });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

module.exports = { getArchives, createArchive, createArchives, updateArchive, deleteById };
