const { Post } = require("../models/post");
const { Archive } = require("../models/archive");
const multer = require('multer');
const path = require('path');

const sinPostID = async (req, res, next) => {
  try {
    const data = await Post.findById(req.params.id);
    if (!data) {
      return res.status(400).json({ message: 'El post asociado no existe' });
    }
    next();
  } catch (error) {
    console.error(error) //
    return res.status(500).json({ message: 'Error al buscar el post' });
  }
};

const sinId = async (req, res, next) => {
  try {
    const archive = await Archive.findById(req.params.id);
    if (!archive) {
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }
    req.archive = archive; 
    next();
  } catch (error) {
    console.error(error) //
    return res.status(500).json({ error: 'Error al buscar el archivo' });
  }
};

const validarImagen = (req, res, next) => {
  const imagen = req.body.imagen;
  if (!imagen) {
    return res.status(400).json({ error: 'Falta la ruta de la imagen' });
  }
  next();
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
    cb(new Error('Solo se permiten imágenes (jpg, jpeg, png, gif)'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter
});

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
};

module.exports = {  sinPostID,  sinId,  validarImagen,  fileFilter,  upload,  validarArchivos};
