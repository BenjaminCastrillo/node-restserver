const express = require('express');
const bcrypt = require('bcrypt');

const _ = require('underscore');

const app = express();

const bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended: false }))

// cargamos el objeto usuario con sus propiedades y metodos de mongoose 
const Usuario = require ('../models/usuario');
// const usuario = require('../models/usuario');

app.get('/usuario', function (req, res) {
    
  // Obtener el parametro opcionas desde
  let desde =req.query.desde || 0;
  desde = Number (desde);
  let limite =req.query.limite || 5;
  limite = Number (limite);

  Usuario.find({estado:false},'nombre email role estado google')
        .skip(desde)
        .limit(limite)
        .exec ((err,usuarioDB)=>{
          if (err){
            return res.status(400).json({
              ok:false,
              err:err
            });
          }
          Usuario.countDocuments({estado:true},(err,conteo)=>{
            res.json({
              ok:true,
              usuarios: usuarioDB,
              registros: conteo
            })

          })

       })

})


app.post('/usuario', function (req, res) {
  let body = req.body;

  // creamos un nuevo objeto del tipo Usuario con los datos recibidos en el body
  let usuario = new Usuario({
      nombre:body.nombre,
      email:body.email,
      password: bcrypt.hashSync(body.password,10),
      role:body.role
  });

/*  save es un metodo de mongoose que hereda usuario y permite salvar en la bbdd. Tiene como 
    parámetro una callback
    usuarioDB es al respuesta de lo que se grabo en Mongo
    si se produce un error este estara en err sino lo trabado en usuarioDB
*/
  usuario.save((err,usuarioDB)=>{

    if (err){
      return res.status(400).json({
        ok:false,
        err:err
      })
    }
    // Ponemos el valor de password a null para que no se vea el valoer en la repuesta
    // usuarioDB.password=null;

    res.json({
      ok:true,
      usuario:usuarioDB
    })
  });

});

app.put('/usuario/:id', function (req, res) {
    let id= req.params.id;

    // let body= req.body;
    // Para evitar que se modifiquen las propiedades password y google
    // delete body.password;
    //delete body.google;
    // Esto hace lo mismo que lo anterior

    let body = _.pick(req.body,['nombre','email','img','role','estado']);

    Usuario.findByIdAndUpdate(id,body, {new:true, runValidators:true},(err,usuarioDB)=>{
      if (err){
        return res.status(400).json({
          ok:false,
          err:err
        });
      }
      res.json({
        ok: true,
        usuario:usuarioDB
      });

    })

})
/*
// Borrado fisico del registro
app.delete('/usuario/:id', function (req, res) {
  let id= req.params.id;  
  Usuario.findByIdAndRemove(id,(err,usuarioDB)=>{
    if (err){
      return res.status(400).json({
        ok:false,
        err:err
      });
    }
 
    if(!usuarioDB){
      return res.status(400).json({
        ok:false,
        err:{
          message: "usuario no encontrado"
        }
      });

    }

    res.json({
      ok: true,
      usuario:usuarioDB
    });

  })
 
})
*/

// Borrado logico del registro
app.delete('/usuario/:id', function (req, res) {
  let id= req.params.id;  
  
  let nuevoEstado={
    estado : false
  }
  
    
  Usuario.findByIdAndUpdate(id,nuevoEstado, {new:true, runValidators:true},(err,usuarioDB)=>{
    if (err){
      return res.status(400).json({
        ok:false,
        err:err
      });
    }

    res.json({
      ok: true,
      usuario:usuarioDB
    });

  })
 
})
// exportamos solo app
  module.exports = app;