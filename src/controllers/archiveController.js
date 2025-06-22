const Archive = require("../models/archive");
const Post = require("../models/post");
const { getModelsCache } = require("./genericController");
const { redisClient } = require('../config/redisClient');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

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
    if (!archivos || archivos.length === 0) {return res.status(400).json({ error: 'No se subieron imágenes' })}
    const nuevasEntradas = await Promise.all(
      archivos.map(file =>
        Archive.create({
          imagen: `/uploads/${file.filename}`,
          postId,
        })
      )
    );
    const archivosIds = nuevasEntradas.map(archivo => archivo._id);
    await Post.findByIdAndUpdate(
      postId,
      { $push: { imagenes: { $each: archivosIds } } },
      { new: true }
    );
    await redisClient.sendCommand(['DEL', 'archives:todos']);
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
    const rutaAnterior = path.join(process.cwd(), 'uploads', req.archive.imagen.replace(/^\/+uploads[\/\\]?/, ''));
    if (fs.existsSync(rutaAnterior)) {
      fs.unlinkSync(rutaAnterior);
      console.log("Imagen física eliminada:", rutaAnterior);
    } else {
      console.log("Imagen física no encontrada:", rutaAnterior);
    }

    req.archive.imagen = `/uploads/${req.file.filename}`;
    await req.archive.save();
    await redisClient.del('archives:todos');
    res.status(200).json(req.archive);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteById = async (req, res) => {
  try {
    const archiveId = req.params.id;
    const archive = await Archive.findById(archiveId);
    if (!archive) {return res.status(404).json({ error: 'Imagen no encontrada' })}
    const rutaFisica = path.join(process.cwd(), 'uploads', archive.imagen.replace(/^\/+uploads[\/\\]?/, ''));
    if (fs.existsSync(rutaFisica)) {
      fs.unlinkSync(rutaFisica);
      console.log("Imagen física eliminada:", rutaFisica);
      //BUCHE
      const usuarioQueElimina = req.user?.email || req.user?.username || 'desconocido';
      console.log(`Imagen eliminada por: ${usuarioQueElimina}`);
      //
    } else {
      console.log("Imagen física no encontrada:", rutaFisica);
    }
    await archive.deleteOne();
    if (archive.postId) {
      await Post.findByIdAndUpdate(
        archive.postId,
        { $pull: { imagenes: new mongoose.Types.ObjectId(archive._id) } }
      );
    }
    await Promise.all([
      redisClient.del('archives:todos'),
      redisClient.del(`Archive:${archiveId}`)
    ]);
    res.status(200).json({ message: 'Imagen eliminada correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getArchives, createArchives, updateArchive, deleteById };

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
