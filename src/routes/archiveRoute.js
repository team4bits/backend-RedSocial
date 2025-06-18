const { Router } = require('express');
const router = Router();
const { archiveController } = require("../controllers");
const { archiveMiddleware } = require("../middlewares");
const upload = require('../middlewares/upload');

router.get('/', archiveController.getArchives);

router.post('/:id', archiveMiddleware.sinPostID, upload.array('imagenes', 5), archiveMiddleware.validarArchivos, archiveController.createArchives);

router.put('/:id', archiveMiddleware.sinId, upload.single('imagenes'), archiveMiddleware.validarArchivos, archiveController.updateArchive);

router.delete('/:id', archiveMiddleware.sinId, archiveController.deleteById);

module.exports = router;