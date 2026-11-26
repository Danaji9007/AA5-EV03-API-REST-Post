/**
 * Rutas del recurso Post.
 *
 * El router se monta en /servicios, por lo que:
 *   GET    /servicios            lista todos los posts
 *   POST   /servicios            crea un post
 *   GET    /servicios/:postId    consulta un post por su identificador
 *   PUT    /servicios/:postId    actualiza un post completo
 *   PATCH  /servicios/:postId    actualiza parcialmente un post
 *   DELETE /servicios/:postId    elimina un post
 */

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Post = require('../models/post');

/**
 * Comprueba que el identificador recibido tenga formato de ObjectId de
 * MongoDB, para responder 400 en lugar de provocar un error interno.
 *
 * @param {string} id Identificador recibido en la URL
 * @returns {boolean} Verdadero si el formato es valido
 */
function esIdValido(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

/**
 * Normaliza los campos editables recibidos en el cuerpo de la solicitud.
 * Solo se copian las claves presentes, de modo que PATCH pueda actualizar
 * parcialmente sin sobrescribir con valores vacios.
 *
 * @param {object} body Cuerpo de la solicitud
 * @returns {object} Campos listos para asignar
 */
function camposEditables(body) {
  const campos = {};

  if (Object.prototype.hasOwnProperty.call(body, 'tittle')) {
    campos.tittle = body.tittle;
  }

  if (Object.prototype.hasOwnProperty.call(body, 'description')) {
    campos.description = body.description;
  }

  return campos;
}

// Crear un post.
router.post('/', async (req, res) => {
  try {
    const post = new Post({
      tittle: req.body.tittle,
      description: req.body.description
    });

    const guardado = await post.save();
    res.status(201).json(guardado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Listar todos los posts, del mas reciente al mas antiguo.
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Consultar un post por su identificador.
router.get('/:postId', async (req, res) => {
  if (!esIdValido(req.params.postId)) {
    return res.status(400).json({ message: 'Identificador no valido' });
  }

  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Actualizar un post completo.
router.put('/:postId', async (req, res) => {
  if (!esIdValido(req.params.postId)) {
    return res.status(400).json({ message: 'Identificador no valido' });
  }

  const campos = camposEditables(req.body);

  if (Object.keys(campos).length === 0) {
    return res.status(400).json({ message: 'No se enviaron campos para actualizar' });
  }

  try {
    const actualizado = await Post.findByIdAndUpdate(
      req.params.postId,
      { $set: campos },
      { new: true, runValidators: true, context: 'query' }
    );

    if (!actualizado) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Actualizar parcialmente un post.
router.patch('/:postId', async (req, res) => {
  if (!esIdValido(req.params.postId)) {
    return res.status(400).json({ message: 'Identificador no valido' });
  }

  const campos = camposEditables(req.body);

  if (Object.keys(campos).length === 0) {
    return res.status(400).json({ message: 'No se enviaron campos para actualizar' });
  }

  try {
    const actualizado = await Post.findByIdAndUpdate(
      req.params.postId,
      { $set: campos },
      { new: true, runValidators: true, context: 'query' }
    );

    if (!actualizado) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Eliminar un post.
router.delete('/:postId', async (req, res) => {
  if (!esIdValido(req.params.postId)) {
    return res.status(400).json({ message: 'Identificador no valido' });
  }

  try {
    const eliminado = await Post.findByIdAndDelete(req.params.postId);

    if (!eliminado) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    res.json({ message: 'Post eliminado correctamente', post: eliminado });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
