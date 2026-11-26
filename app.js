/**
 * Servidor de la API REST.
 *
 * Configura Express, registra el middleware que interpreta las solicitudes en
 * formato JSON y monta las rutas del recurso Post bajo el prefijo /servicios.
 * La conexion a MongoDB se realiza antes de poner el servidor a escuchar, de
 * modo que la API no atiende solicitudes sin base de datos disponible.
 */

const express = require('express');
const mongoose = require('mongoose');

// Carga las variables del archivo .env (puerto y cadena de conexion).
require('dotenv').config();

const app = express();

// Middleware: convierte el cuerpo JSON de cada solicitud en req.body.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas del recurso Post.
const postRoute = require('./routes/post');
app.use('/servicios', postRoute);

// Ruta por defecto, util para comprobar que el servidor esta activo.
app.get('/', (req, res) => {
  res.send('API funcionando correctamente');
});

const PORT = process.env.PORT || 10000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Falta la variable MONGODB_URI. Revisa el archivo .env');
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB conectado');
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error de conexion a MongoDB:', error.message);
    process.exit(1);
  });

module.exports = app;
