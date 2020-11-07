const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs=require('fs');
const path=require('path');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {

  const tipo = req.params.tipo;
  const id= req.params.id;
console.log(tipo);
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
                ok:false,
                err:{
                    message: 'No se ha seleccionado ningun archivo'
                }
        })
            
      }
      let tiposValidos=['usuarios','productos'];
      if (tiposValidos.indexOf(tipo)<0){
        return res.status(400).json({
          ok:false,
          err:{
              message: 'Los tipos validos son '+tiposValidos.join(', ')
          }
         })
      }

      let archivo = req.files.archivo;
      let nombreArchivo= archivo.name.split('.');
      let extension= nombreArchivo[nombreArchivo.length-1];
      console.log(archivo);

      // extensiones validas
      
      const extensionesValidas=['jpg','png','gif','jpeg']

      if (extensionesValidas.indexOf(extension)<0){
        return res.status(400).json({
          ok:false,
          err:{
              message: 'Las extension validas son '+extensionesValidas.join(', ')
          }
  })
      }
// cambiar el nombre al archivo
      nombreArchivo=`${id}-${new Date().getMilliseconds()}.${extension}`;
  //    nombreArchivo=`${archivo.md5}.${extension}`;

      archivo.mv(`uploads/${tipo}/${nombreArchivo}`, function(err) {
        if (err)
          return res.status(500).json({
            ok:false,
            err
          });

// guardar el nombre de la imagen en la base de datos
if (tipo==='usuarios'){
      imagenUsuario(id,res,nombreArchivo);
}else{
  imagenProducto(id,res,nombreArchivo);
}

      });

})
function imagenUsuario(id,res,nombreArchivo){

  Usuario.findById(id,(err,usuarioDB)=>{
    if(err){
      borraArchivo(nombreArchivo,'usuarios'); // la tengo que borrar por que se grabo en el disco
      return res.status(500).json({
        ok:false,
        err
      });
    }
    if (!usuarioDB){
      borraArchivo(nombreArchivo,'usuarios')
      return res.status(400).json({
        ok:false,
        err:{
          message:'Usuario no existe'
        }
      });
    }
 
    borraArchivo(usuarioDB.img,'usuarios');

    usuarioDB.img=nombreArchivo;
    usuarioDB.save((err,usuarioGuardado)=>{
      res.json({
        ok:true,
        usuario: usuarioGuardado
      })

    })
  })

}

function imagenProducto(id,res,nombreArchivo){

  Producto.findById(id,(err,productoDB)=>{
    if(err){
      borraArchivo(nombreArchivo,'productos'); // la tengo que borrar por que se grabo en el disco
      return res.status(500).json({
        ok:false,
        err
      });
    }
    if (!productoDB){
      borraArchivo(nombreArchivo,'productos')
      return res.status(400).json({
        ok:false,
        err:{
          message:'Producto no existe'
        }
      });
    }
 
    borraArchivo(productoDB.img,'productos');

    productoDB.img=nombreArchivo;
    productoDB.save((err,productoGuardado)=>{
      res.json({
        ok:true,
        producto: productoGuardado
      })

    })
  })
}

function borraArchivo(nombreImagen,tipo){

   // Para borrar el fichero existente
   let pathImagen=path.resolve(__dirname,`../../uploads/${tipo}/${nombreImagen}`)
   if(fs.existsSync(pathImagen)){
     fs.unlinkSync(pathImagen);
   }

}
module.exports = app;