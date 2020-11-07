const express= require ('express');

const app = express();
const fs=require('fs');
const path=require('path');
let {verificaTokenImg}= require ('../middlewares/autenticacion');

app.get('/imagen/:tipo/:img', verificaTokenImg,(req, res)=> {
let tipo =req.params.tipo;
let imagen=req.params.img;

let pathImagen=path.resolve(__dirname,`../../uploads/${tipo}/${imagen}`)
if (fs.existsSync(pathImagen)){
    res.sendFile(pathImagen);
}else{
    let nopathImagen=path.resolve(__dirname,'../assets/no-image.jpg')
    res.sendFile(nopathImagen);
}

})


module.exports = app;