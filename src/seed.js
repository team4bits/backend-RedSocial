const mongoose = require('./config/db');
const { User, Post, Comment, Tag, Archive } = require('./models');
const { mongo } = require('./config');

// Función para limpiar la base de datos
const cleanDB = async () => {
  await User.deleteMany({});
  await Post.deleteMany({});
  await Comment.deleteMany({});
  await Tag.deleteMany({});
  await Archive.deleteMany({});
  
  // Eliminar índices problemáticos
  try {
    await Tag.collection.dropIndex("tag_1");
    console.log('Índice tag_1 eliminado');
  } catch (error) {
    console.log('Índice tag_1 no existía');
  }
  
  try {
    await Post.collection.dropIndex("tags_1");
    console.log('Índice tags_1 eliminado');
  } catch (error) {
    console.log('Índice tags_1 no existía');
  }
  
  console.log('Base de datos limpiada');
};

// Función principal para ejecutar el seed
const runSeed = async () => {
  try {
    // Conectar a MongoDB usando la misma configuración que main.js
    await mongo.conectarDB();
    
    // Limpiar la base de datos
    await cleanDB();

    // 1. Crear usuarios (sin relaciones)
    const user1 = await User.create({
      nickName: 'usuario1',
      email: 'usuario1@example.com'
    });

    const user2 = await User.create({
      nickName: 'usuario2',
      email: 'usuario2@example.com'
    });

    console.log('Usuarios creados');

    // 2. Crear tags (sin relaciones)
    const tag1 = await Tag.create({
      nameTag: 'programacion'
    });

    const tag2 = await Tag.create({
      nameTag: 'viajes'
    });

    const tag3 = await Tag.create({
      nameTag: 'comida'
    });

    console.log('Tags creados');

    // 3. Crear archivos (sin relaciones inicialmente)
    const archive1 = await Archive.create({
      imagen: '/uploads/imagen1.jpg'
    });

    const archive2 = await Archive.create({
      imagen: '/uploads/imagen2.jpg'
    });

    const archive3 = await Archive.create({
      imagen: '/uploads/imagen3.jpg'
    });

    console.log('Archivos creados');

    // 4. Crear posts (ahora con ObjectIds válidos)
    const post1 = await Post.create({
      userId: user1._id,
      content: 'Este es mi primer post sobre programación en JavaScript'
      // No agregamos relaciones complejas todavía
    });

    const post2 = await Post.create({
      userId: user2._id,
      content: 'Acabo de regresar de un viaje increíble a la montaña'
    });

    console.log('Posts creados');

    // 5. Crear comentarios
    const comment1 = await Comment.create({
      postId: post1._id,
      userId: user2._id,
      content: 'Excelente post sobre JavaScript, muy informativo'
    });

    const comment2 = await Comment.create({
      postId: post2._id,
      userId: user1._id,
      content: 'Qué bonitas fotos de tu viaje, ¿dónde fue exactamente?'
    });

    console.log('Comentarios creados');

    // 6. Ahora actualizar las relaciones
    // Actualizar posts con sus relaciones
    await Post.findByIdAndUpdate(post1._id, {
      $push: { 
        comments: comment1._id,
        tags: tag1._id,
        imagenes: [archive1._id, archive2._id]
      }
    });

    await Post.findByIdAndUpdate(post2._id, {
      $push: { 
        comments: comment2._id,
        tags: { $each: [tag2._id, tag3._id] },
        imagenes: archive3._id
      }
    });

    // Actualizar usuarios con sus posts y comentarios
    await User.findByIdAndUpdate(user1._id, {
      $push: { 
        posts: post1._id,
        comments: comment2._id
      }
    });

    await User.findByIdAndUpdate(user2._id, {
      $push: { 
        posts: post2._id,
        comments: comment1._id
      }
    });

    // Actualizar archivos con sus posts
    await Archive.findByIdAndUpdate(archive1._id, { postId: post1._id });
    await Archive.findByIdAndUpdate(archive2._id, { postId: post1._id });
    await Archive.findByIdAndUpdate(archive3._id, { postId: post2._id });

    console.log('Relaciones actualizadas');
    console.log('Seed completado exitosamente!');
    
  } catch (error) {
    console.error('Error en el seed:', error);
  } finally {
    // Cerrar la conexión a MongoDB
    process.exit(0);
  }
};

// Ejecutar el seed
runSeed();