
const express= require ('express');

let {verificaToken}= require ('../middlewares/autenticacion');

let app=express();
let Producto=require('../models/producto');


// obtener todos los productos

//paginado

app.get('/producto',verificaToken,(req,res)=>{

    let desde = req.query.desde ||0;
    desde=Number(desde);

    Producto.find({disponible:true})
    .skip(desde)
    .limit(5)
    .sort('nombre')
    .populate('categoria','descripcion')
    .populate('usuario','nombre email')
    .exec((err,productoDB)=>{
        if (err){
            return res.status(500).json({
            ok:false,
            err:err
            });
        }
        res.json({
            ok:true,
            producto:productoDB
        })
    });

});

// Obtener un producto por id
app.get('/producto/:id',verificaToken,(req,res)=>{

    let id=req.params.id;
  //  Producto.findById(id,(err,productoDB)=>{
    Producto.findById({_id:id})
    .populate('categoria','descripcion')
    .populate('usuario','nombre email')
    .exec((err,productoDB)=>{
        if (err){
            return res.status(500).json({
            ok:false,
            err:err
            });
        }
        if (!productoDB){
            return res.status(400).json({
            ok:false,
            err:{
                message:'el id no existe'
            }
            });
        }
        res.json({
            ok:true,
            producto:productoDB
        })

    })
});

// Buscar producto

app.get('/producto/buscar/:termino',verificaToken,(req,res)=>{
    
    let termino=req.params.termino;
    let regex= new RegExp(termino,'i');

    Producto.find({nombre:regex})
        .populate('categoria','descripcion')
        .exec((err,producto)=>{
            if (err){
                return res.status(500).json({
                ok:false,
                err:err
                });
            }
            res.json({
                ok:true,
                producto:producto
            })


    })



})

// Crear un producto
app.post('/producto',verificaToken,(req,res)=>{

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        disponible:body.disponible,
        descripcion: body.descripcion,
        categoria:body.categoria,
        usuario:req.usuario._id
    })
    producto.save((err,productoDB)=>{
        
        if (err){
            return res.status(500).json({
            ok:false,
            err:err
            });
        }

        if (!productoDB){
            return res.status(400).json({
            ok:false,
            err:err
            });
        }
        res.status(201).json({
            ok:true,
            producto:productoDB
        })
    });
});

// Actualizar un producto
app.put('/producto/:id',verificaToken,(req,res)=>{

    let id=req.params.id;
    let body = req.body;

    Producto.findById(id,(err,productoDB)=>{
        
        if (err){
            return res.status(500).json({
            ok:false,
            err:err
            });
        }
        if (!productoDB){
            return res.status(400).json({
            ok:false,
            err:'el producto no existe'
            });
        }
        productoDB.nombre= body.nombre;
        productoDB.precioUni= body.precioUni;
        productoDB.disponible=body.disponible;
        productoDB.descripcion= body.descripcion;
        productoDB.categoria=body.categoria;

        productoDB.save((err,productoGuardado)=>{
            if (err){
                return res.status(500).json({
                ok:false,
                err:err
                });
            }
            res.json({
                ok:true,
                producto:productoGuardado
            })

        })
    })


});




// Borrar un producto Cambiar el campo disponible
app.delete('/producto/:id',verificaToken,(req,res)=>{


    let id=req.params.id;
    Producto.findByIdAndUpdate(id,{disponible:false },{new:true, runValidators:true},(err,productoDB)=>{

        if (err){
            return res.status(500).json({
                ok:false,
                err:err
                });           
        }
        if (!productoDB){
            return res.status(400).json({
            ok:false,
            err:{
                message:'el id no existe'
            }
            });
        }
        res.json({
            ok:true,
            message:'producto borrado'
        })

    })
});

module.exports=app
