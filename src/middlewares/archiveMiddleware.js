const Post = require("../models/post");
const Archive = require("../models/archive");
const mongoose = require("mongoose");
const { redisClient } = require("../config/redisClient");
const multer = require('multer');
const path = require('path');
const { errorPersonalizado } = require('./genericMiddleware');

const sinPostID = async (req, res, next) => {
  try {
    const postId = req.body.postId;
    if (!postId) {return errorPersonalizado('Falta el campo postId en el body',400,next)};
    if (!mongoose.Types.ObjectId.isValid(postId)) {return errorPersonalizado('El ID del post es inválido',400,next)};    
    const cached = await redisClient.get(`Post:${postId}`);
    if (cached) {req.post = JSON.parse(cached);
      return next();
    }
    const post = await Post.findById(postId);
    if (!post) {return errorPersonalizado('El post asociado no existe',404,next)};
    await redisClient.set(`Post:${postId}`, JSON.stringify(post), { EX: 300 });
    req.post = post; 
    next();
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const archiveById = async (req, res, next) => {
  const archiveId = req.params.id?.trim();
  if (!archiveId || !mongoose.Types.ObjectId.isValid(archiveId)) {    
    return errorPersonalizado('El ID de la imagen es inválido', 400, next);
  }
  try {
    const cached = await redisClient.get(`Archive:${archiveId}`);
    if (cached) {
      const parsed = JSON.parse(cached);
      req.archive = new Archive(parsed);
      return next();
    }
    const archive = await Archive.findById(archiveId);
    if (!archive) {return errorPersonalizado('Imagen no encontrada', 404, next)};
    await redisClient.set(`Archive:${archiveId}`, JSON.stringify(archive), { EX: 300 });
    req.archive = archive;
    next();
  } catch (error) {
    //console.error("Error en archiveById:", error);
    next(error);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;
  
  if (allowedTypes.test(ext) && allowedTypes.test(mime)) {
    cb(null, true);
  } else {    
    const error = new multer.MulterError('LIMIT_UNEXPECTED_FILE');
    error.message = 'Solo se permiten imágenes (jpg, jpeg, png, gif)';
    cb(error, false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter
});

module.exports = {  sinPostID,  archiveById, fileFilter,  upload};

/* si hace falta para el manejo de errores

const validarImagen = (req, res, next) => {
  const imagen = req.body.imagen;
  if (!imagen) {
    return res.status(400).json({ error: 'Falta la ruta de la imagen' });
  }
  next();
};

const validarArchivos = (req, res, next) => {
  const archivos = req.files;
  if (!archivos || archivos.length === 0) {
    return res.status(400).json({ error: 'Debe subir al menos una imagen' });
    }
    for (const file of archivos) {
      if (!file.mimetype.startsWith('image/')) {
        return res.status(400).json({ error: 'Todos los archivos deben ser imágenes' });
        }
    if (file.size > 5 * 1024 * 1024) {
      return res.status(400).json({ error: 'Cada imagen debe pesar menos de 5MB' });
      }
  }
  next();
};*/