const jwt = require('jsonwebtoken');


// Verificar token

let verificaToken=(req,res,next)=>{
    let token =req.get('authorization');

    // Parea verificar el token recibido 
    // en decoded esta el token decodificado decoded.usuario
 //   console.log(token);

    jwt.verify(token,process.env.SEED_AUTHENTICATION,(err, decoded)=>{
        if (err){
            return res.status(401).json({
                ok:false,
                err
            })
        }
        req.usuario=decoded.usuario;
        next(); // para que ejecute el tercer parametro de la ruta
    })

};
// Verificar token recibido desde la url para imagen

let verificaTokenImg=(req,res,next)=>{

let token=req.query.token;

jwt.verify(token,process.env.SEED_AUTHENTICATION,(err, decoded)=>{
    if (err){
        return res.status(401).json({
            ok:false,
            err
        })
    }
    req.usuario=decoded.usuario;
    next(); // para que ejecute el tercer parametro de la ruta
})


}
// Verifica rol de administrador

let verificaAdmin_Role =(req,res,next)=>{

    let role =req.usuario.role;
    console.log(role);
    if (role!='ADMIN_ROLE'){
        return res.status(401).json({
            ok:false,
            message:'Se precisa rol de administrador',
        })
    }
    next();
}


module.exports={
    verificaToken,
    verificaAdmin_Role,
    verificaTokenImg
}