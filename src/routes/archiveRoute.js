const { Router } = require('express');
const router = Router();
const { archiveController } = require("../controllers");
const { archiveMiddleware } = require("../middlewares");
const upload = require('../middlewares/upload');

router.get('/', archiveController.getArchives);
router.post('/', upload.array('imagenes', 5), archiveMiddleware.sinPostID, archiveController.createArchives);
router.put('/:id', archiveMiddleware.archiveById, upload.single('imagenes'), archiveController.updateArchive);
router.delete('/:id', archiveMiddleware.archiveById, archiveController.deleteById);
module.exports = router;