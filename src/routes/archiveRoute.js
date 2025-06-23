const { Router } = require('express');
const router = Router();
const { Post, Archive } = require("../models");
const { archiveController } = require("../controllers");
const { archiveMiddleware, genericMiddleware } = require("../middlewares");
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
    genericMiddleware.existModelRequest(Post), 
    archiveController.createArchives);

router.put('/:id',
    /* 
        #swagger.tags = ['Archives']
        #swagger.path = '/archives/{id}'
    */
    archiveMiddleware.archiveById, 
    upload.single('imagenes'), 
    archiveController.updateArchive);

router.delete('/:id', 
    /* 
        #swagger.tags = ['Archives']
        #swagger.path = '/archives/{id}'
    */
    archiveMiddleware.archiveById, 
    archiveController.deleteById);

module.exports = router;