const express= require ('express');

let {verificaToken, verificaAdmin_Role}= require ('../middlewares/autenticacion');
let app = express();

let Categoria= require('../models/categoria');

//
// Mostrar todas las categorias
//
app.get('/categoria',verificaToken,(req,res)=>{
    Categoria.find({})
    .sort('descripcion')
    .populate('usuario','nombre email')
    .exec((err,categorias)=>{
        if (err){
            return res.status(500).json({
            ok:false,
            err:err
            });
        }
        res.json({
            ok:true,
            categorias
        })
    });

});

//
// Mostrar una categoria por id
//
app.get('/categoria/:id',verificaToken,(req,res)=>{

    let id=req.params.id;
    Categoria.findById(id,(err,categoriaDB)=>{
        if (err){
            return res.status(500).json({
            ok:false,
            err:err
            });
        }
        if (!categoriaDB){
            return res.status(400).json({
            ok:false,
            err:{
                message:'el id no existe'
            }
            });
        }
        res.json({
            ok:true,
            categoria:categoriaDB
        })

    })
});


//
// Crear una categoria
// regresa la nueva categoria 
// req.usuario._id
app.post('/categoria',verificaToken,(req,res)=>{

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario:req.usuario._id
    })
    categoria.save((err,categoriaDB)=>{
        
        if (err){
            return res.status(500).json({
            ok:false,
            err:err
            });
        }

        if (!categoriaDB){
            return res.status(400).json({
            ok:false,
            err:err
            });
        }
        res.json({

            ok:true,
            categoria:categoriaDB
        })

    });

});

//
// actualiza una categoria
// 
app.put('/categoria/:id',verificaToken,(req,res)=>{

let id=req.params.id;
let body=req.body;
let descCategoria={
    descripcion: body.descripcion
}

Categoria.findByIdAndUpdate(id,descCategoria ,{new:true, runValidators:true},(err,categoriaDB)=>{
    if (err){
        return res.status(500).json({
        ok:false,
        err:err
        });
    }
console.log(categoriaDB);
    if (!categoriaDB){
        return res.status(400).json({
        ok:false,
        err:err
        });
    }
    res.json({

        ok:true,
        categoria:categoriaDB
    })
})

});
//
// Borrar una categoria
// Solo lo puede hacer el administrador
// categoria.findByIdAndRemove
app.delete('/categoria/:id',[verificaToken, verificaAdmin_Role],(req,res)=>{


    let id=req.params.id;

    Categoria.findByIdAndDelete(id,(err,categoriaDB)=>{

        if (err){
            return res.status(500).json({
                ok:false,
                err:err
                });           
        }
        if (!categoriaDB){
            return res.status(400).json({
            ok:false,
            err:{
                message:'el id no existe'
            }
            });
        }
        res.json({
            ok:true,
            message:'categoria borrada'
        })

    })
});
module.exports = app;