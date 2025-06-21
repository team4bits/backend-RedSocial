const { Router } = require('express');
const router = Router();
const { archiveController } = require("../controllers");
const { archiveMiddleware } = require("../middlewares");
const upload = require('../middlewares/upload');

router.get('/', 
  /* 
    #swagger.tags = ['Archives']
    #swagger.path = '/archives'
    */ 
  archiveController.getArchives);

router.post('/',
  /* 
    #swagger.tags = ['Archives']
    #swagger.path = '/archives'
    */
  upload.array('imagenes', 5),
  archiveMiddleware.validarArchivos,
  archiveController.createArchives
);

router.put('/:id', 
  /* 
    #swagger.tags = ['Archives']
    #swagger.path = '/archives/{id}'
    */
  archiveMiddleware.sinId
    , upload.single('imagenes')
    , archiveMiddleware.validarArchivos
    , archiveController.updateArchive);

router.delete('/:id', 
  /* 
    #swagger.tags = ['Archives']
    #swagger.path = '/archives/{id}'
    */
  archiveMiddleware.sinId
    , archiveController.deleteById);

module.exports = router;