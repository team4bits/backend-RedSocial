const { Router } = require('express')
const { postController, archiveController } = require("../controllers");
const { genericMiddleware, postMiddleware } = require("../middlewares");
const { Post, Archive } = require("../models");
const router = Router()

router.get('/',
  genericMiddleware.existsAnyByModel(Post),
  /* 
#swagger.tags = ['Posts']
#swagger.path = '/posts'
*/
  postController.getPosts);

router.get('/:id',
  genericMiddleware.existsModelById(Post),
  /* 
#swagger.tags = ['Posts']
#swagger.path = '/posts/{id}'
*/
  postController.getPostById);


router.post("/",
  postMiddleware.existUserRequest,
  /* 
#swagger.tags = ['Posts']
#swagger.path = '/posts'
*/
  postController.createPost
);

router.put("/:id",
  genericMiddleware.existsModelById(Post),
  postMiddleware.userDoesntChange,
  /* 
    #swagger.tags = ['Posts']
    #swagger.path = '/posts/{id}'
    */
  postController.updatePostById
);

router.delete("/:id",
  genericMiddleware.existsModelById(Post),
  /* 
    #swagger.tags = ['Posts']
    #swagger.path = '/posts/{id}'
    */
  postController.deletePostById
);

//Rutas Archive
router.delete("/:postId/image/:id",
  genericMiddleware.existsModelById(Archive),
  postMiddleware.validarImagenAsociadaAPost,
  /* 
    #swagger.tags = ['Post Image']
    #swagger.path = '/posts/{id}/tags/{idImage}'
  */
  archiveController.deleteById
);

  router.put("/:postId/image/:id",
    genericMiddleware.existsModelById(Archive),
    postMiddleware.validarImagenAsociadaAPost,
    /* 
    #swagger.tags = ['Post Image']
    #swagger.path = '/posts/{id}/tags/{idImage}'
    */
    archiveController.updateArchive
  );

module.exports = router;