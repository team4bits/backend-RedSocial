const { Router } = require('express')
const { tagController } = require("../controllers");
const { genericMiddleware, tagMiddleware } = require("../middlewares");

const { Tag } = require("../models");
const router = Router()

router.get('/', 
    genericMiddleware.existsAnyByModel(Tag),
    /* 
    #swagger.tags = ['Tags']
    #swagger.path = '/tags'
    */ 
   tagController.getTags);

router.get('/:id', 
    genericMiddleware.existsModelById(Tag),
    /* 
    #swagger.tags = ['Tags']
    #swagger.path = '/tags/{id}'
    */
    tagController.getTagById);


router.post('/',
  tagMiddleware.notExistsTag,
  tagMiddleware.postDoesntExists,
  genericMiddleware.validarCamposExactos(Tag),
  /* 
    #swagger.tags = ['Tags']
    #swagger.path = '/tags'
    */
  tagController.createTag);

router.put("/:id",
  genericMiddleware.existsModelById(Tag),
  /* 
    #swagger.tags = ['Tags']
    #swagger.path = '/tags/{id}'
    */
  tagController.updateTagById);

router.delete("/:id",
  genericMiddleware.existsModelById(Tag),
  /* 
    #swagger.tags = ['Tags']
    #swagger.path = '/tags/{id}'
    */
  tagController.deleteById);

module.exports = router;