const {Router} = require('express');
const {commentController} = require('../controllers');
const {genericMiddleware} = require('../middlewares');
const {Comment} = require('../models');
const router = Router();

//Obtener todos los comentarios
router.get('/',
    commentController.getComments
);

//Crear un nuevo comentario
router.post('/',
    commentController.createComment
)
//Actualizar un comentario por id
router.put('/:id',
    genericMiddleware.existsModelById(Comment),
    commentController.updateComment
)
//Borrar un comentario por id
router.delete('/:id',
    genericMiddleware.existsModelById(Comment),
    commentController.deleteComment
)
//Obtener un comentario por id
router.get('/:id',
    genericMiddleware.existsModelById(Comment),
    commentController.getCommentById
);
//Exportar el router
module.exports = router;