const {Router} = require('express');
const {commentController} = require('../controllers');
const router = Router();

//Obtener todos los comentarios
router.get('/',
    commentController.getComments
);
//Obtener todos los comentarios de un post
router.get('/:postId',
    commentController.getPostComments
)
//Crear un nuevo comentario
router.post('/',
    commentController.createComment
)
//Actualizar un comentario por id
router.put('/:id',
    commentController.updateComment
)
//Borrar un comentario por id
router.delete('/:id',
    commentController.deleteComment
)
//Exportar el router
module.exports = router;