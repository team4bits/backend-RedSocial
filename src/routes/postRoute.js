const { Router } = require('express')
const { postController } = require("../controllers");
const router = Router()

router.get('/', 
    postController.getPosts);

router.get('/:id', 
    postController.getPostById);


router.post(
  "/",
  postController.createPost
);

router.put(
  "/:id",
  postController.updatePostById
);

router.delete(
  "/:id",
  postController.deletePostById
);

module.exports = router;