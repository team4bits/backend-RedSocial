const { Router } = require('express')
const { postController } = require("../controllers");
const { genericMiddleware, postMiddleware } = require("../middlewares");
const { Post } = require("../models");
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

router.post(
  '/:postId/tags/:tagId',
  postMiddleware.existsPostYTagPorId,
  /* 
    #swagger.tags = ['Post Tag']
    #swagger.path = '/posts/{postId}/tags/{tagId}'
  */
  postController.actualizarTag("agregar")
);

router.delete(
  '/:postId/tags/:tagId',
  postMiddleware.existsPostYTagPorId,
  /* 
    #swagger.tags = ['Post Tag']
    #swagger.path = '/posts/{postId}/tags/{tagId}'
  */
  postController.actualizarTag("eliminar")
);

module.exports = router;