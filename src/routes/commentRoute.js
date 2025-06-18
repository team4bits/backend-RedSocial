const {Router} = require('express');
const {commentController} = require('../controllers');
const {genericMiddleware} = require('../middlewares');
const {Post} = require('../models');
const router = Router();

//Obtener todos los comentarios
router.get('/',
    commentController.getComments
);
//Obtener todos los comentarios de un post(mover a postRoute.js)
router.get('/post/:id',
    //Verificar que exista el post
    genericMiddleware.existsModelById(Post),
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