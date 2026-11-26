/**
 * Modelo Post.
 *
 * Define la estructura de los documentos que se almacenan en la coleccion
 * posts de MongoDB. Cada documento representa una publicacion con titulo,
 * descripcion y fecha de creacion automatica.
 */

const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  tittle: {
    type: String,
    required: [true, 'El titulo es obligatorio'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'La descripcion es obligatoria'],
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Post', PostSchema);
