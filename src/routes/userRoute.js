const { Router } = require('express')
const { userController, postController, commentController } = require("../controllers");
const { genericMiddleware, userMiddleware } = require("../middlewares");

const { User, Post, Comment } = require("../models");
const router = Router()

router.get('/', 
    genericMiddleware.existsAnyByModel(User),
    /* 
    #swagger.tags = ['Users']
    #swagger.path = '/users'
    */ 
   userController.getUsers);

router.get('/:id', 
    genericMiddleware.existsModelById(User),
    /* 
    #swagger.tags = ['Users']
    #swagger.path = '/users/{id}'
    */
    userController.getUserById);

router.post(
  "/",
  userMiddleware.notExistsUser,
  userMiddleware.postOrCommentDontExists,
  genericMiddleware.validarCamposExactos(User),
  /* 
    #swagger.tags = ['Users']
    #swagger.path = '/users'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Datos del usuario',
      required: true,
      schema: { $ref: "#/definitions/UserInput" }
    }
  */
  userController.createUser
);

router.put(
  "/:id",
  genericMiddleware.existsModelById(User),
  userMiddleware.postOrCommentDontExists,
  genericMiddleware.validarCamposExactos(User),
  /* 
    #swagger.tags = ['Users']
    #swagger.path = '/users/{id}'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Datos del usuario',
      required: true,
      schema: { $ref: "#/definitions/UserInput" }
    }
  */
  userController.updateUserById
);

router.delete(
  "/:id",
  genericMiddleware.existsModelById(User),
  /* 
    #swagger.tags = ['Users']
    #swagger.path = '/users/{id}'
    */
  userController.deleteById
);

module.exports = router;
