const mongoose = require('mongoose');

const uniqueValidator = require ('mongoose-unique-validator');


// para poder definir modelos de datos. El esquema de las colecciones
let Schema= mongoose.Schema;

let rolesValidos = {
    values: ['ADMIN_ROLE','USER_ROLE'],
    message:'{VALUE} no es un rol valido'
};

// creamos el esquema de la coleccion  de usuarios
let usuarioSchema = new Schema({
    nombre :{
        type: String,
        required: [true,'El nombre es necesario']
    },
    email:{
        type:String,
        unique: true,
        required: [true,'El email es necesario']
    }, 
    password:{
        type: String,
        required: [true,'La contraseña es obligatoria']
    },
    img:{
        type: String,
        required: false
    },
    role:{
        type: String,
        default:'USER_ROLE',
        enum: rolesValidos
    },
    estado:{
        type: Boolean,
        default: true
    },
    google:{
        type: Boolean,
        default:false
    }   

});

// Para evitar imprimir una propiedad del esquema como la password 
// cuando usemos un toJSON

usuarioSchema.methods.toJSON = function(){

    let user= this;
    let userObject = user.toObject();

    delete userObject.password;
    return userObject;

}


usuarioSchema.plugin(uniqueValidator,{message:'{PATH} debe ser único'})

// al exportar el esquema le damos el nombre que 
module.exports=mongoose.model('usuario',usuarioSchema);
