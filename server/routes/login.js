const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require ('jsonwebtoken');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const app = express();
const Usuario = require ('../models/usuario');

// las siguientes lineas las ha generado solo
const { before } = require('underscore');
const { JsonWebTokenError } = require('jsonwebtoken');


app.post ('/login',(req,res)=>{

    let body=req.body;

    Usuario.findOne({email:body.email},(err,usuarioDB)=>{
        
        if (err){
            return res.status(400).json({
              ok:false,
              err:err
            })
        }
        if (!usuarioDB){
            return res.status(400).json({
                ok:false,
                err: {
                    message: '(Usuario) o contraseña incorrectos'
                }
            });
        }
        if (!bcrypt.compareSync(body.password,usuarioDB.password)){
            return res.status(400).json({
                ok:false,
                err: {
                    message: 'Usuario o (contraseña) incorrectos'
                }
            });
        }
       
        let token = jwt.sign({
            usuario:usuarioDB,
        }, process.env.SEED_AUTHENTICATION, {expiresIn: process.env.CADUCIDAD_TOKEN});

        res.json({
            ok:true,
            usuario:usuarioDB,
            token:token
        })
    })
})

// Configuraciones de google

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];

    console.log('ESTOY EN VERIFY');

    return {
        nombre:payload.name,
        email:payload.email,
        img:payload.picture,
        google:true
    }

  };


app.post ('/google',async (req,res)=>{

let token=req.body.idtoken;

let googleUser= await verify (token)
    .catch (e=>{  // por si la verificacion de google falla
        return res.status(403).json({
            ok:false,
            mimensaje:'ESTOY HASTA LAS PELOTAS',
            error:e
        });
    });

    Usuario.findOne({email:googleUser.email},(err, usuarioDB)=>{
        if (err){
            return res.status(500).json({
                ok:false,
                error:err
            }); 
        }
        // Comprobamos si el usuario de google ya exitia en la bbdd
        if(usuarioDB){
           console.log('ENCUENTRO EL USUARIO');
            // vemos si se autentico anteriormente por google
            if(usuarioDB.google === false){        
                 
                return res.status(400).json({
                    ok:false,
                    error: '',
                    message:'Debe usar autenticacion normal'
               });

            }else{ // es un usuario google y tengo que crear el token
                let token = jwt.sign({
                    usuario:usuarioDB,
                }, process.env.SEED_AUTHENTICATION, {expiresIn: process.env.CADUCIDAD_TOKEN});
                console.log('ESTOY AQUI   ',token);    
                return res.json({
                    ok:true,
                    usuario: usuarioDB,
                    token
                });
            }

        }else{ // Si el usuario no existe en nuestra BBDD

            console.log('NO ENCUENTRO EL USUARIO');
            let usuario= new Usuario();

            usuario.nombre=googleUser.nombre;
            usuario.email=googleUser.email;
            usuario.img=googleUser.img;
            usuario.google=true;
            usuario.password=':)'; // nunca se utiliza esta password

            // lo que se va a grabar esta en el objeto usuario
            usuario.save((err,usuarioDB)=>{ // usuarioDB es la respuesta (lo que se grabo)
                if (err){
                  return res.status(400).json({
                    ok:false,
                    err:err
                  })
                }
                let token = jwt.sign({
                    usuario:usuarioDB,
                }, process.env.SEED_AUTHENTICATION, {expiresIn: process.env.CADUCIDAD_TOKEN});
                console.log('ME VOY POR AQUI');
                return res.json({
                    ok:true,
                    usuario: usuarioDB,
                    token
                })
              });
        }

    });

/*

res.json({ 
    usuario:googleUser
});
*/
});


module.exports = app;
