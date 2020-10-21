require ('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

const app = express();
const bodyParser = require('body-parser');
const path = require('path');

// Middlewares

app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded 
app.use(morgan('combined'));

// Habilitar la carpeta public para que sea accesible

app.use(express.static(path.resolve(__dirname,'../public')));

// importamos las rutas desde el indice global de  rutas
app.use(require('./routes/index'));

// configuracion de la conexion a BBDD
const optionsBBDDConnections = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
};


//conexion a mongo

// mongoose.connect('mongodb://localhost:27017/cafe',optionsBBDDConnections)
mongoose.connect(process.env.URLDB,optionsBBDDConnections)
  .then (db => console.log('La DDBB esta conectada'))
  .catch (err => console.log(err));


// arrancar servidor HTTP
app.listen(process.env.PORT, ()=>{      
   console.log('escuchando en el puerto', process.env.PORT);
});