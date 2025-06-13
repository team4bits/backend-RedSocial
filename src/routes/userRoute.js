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
  /* 
    #swagger.tags = ['Users']
    #swagger.path = '/users'
    */
  userController.createUser
);

router.put(
  "/:id",
  genericMiddleware.existsModelById(User),
  /* 
    #swagger.tags = ['Users']
    #swagger.path = '/users/{id}'
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

// //Rutas Posts

// router.get('/:id/posts', 
//   genericMiddleware.existsModelById(User),
//   /* 
//     #swagger.tags = ['Users']
//     #swagger.path = '/users/{id}/posts'
//     */
//   postController.getPostsByUserId
// );

// //Rutas Comments

// router.get('/:id/comments', 
//   genericMiddleware.existsModelById(User),
//   /* 
//     #swagger.tags = ['Users']
//     #swagger.path = '/users/{id}/comments'
//     */
//   commentController.getCommentsByUserId
// );


module.exports = router;
