
// Puerto

process.env.PORT= process.env.PORT || 3000;


//* Entorno 

process.env.NODE_ENV= process.env.NODE_ENV || 'dev';

//* Fecha vendimiento del token

process.env.CADUCIDAD_TOKEN= 60*60*24*120;

//* Semilla de autenticación


process.env.SEED_AUTHENTICATION= process.env.SEED_AUTHENTICATION || 'este-es-el-seed-de-desarrollo'

//* BBDD mongo

let urlDB;

if (process.env.NODE_ENV==='dev'){
   urlDB ='mongodb://localhost:27017/cafe'
}
else{

   // urlDB='mongodb+srv://Benjamin:FCxu72hdKS78C3f7@cluster0.zkk3k.mongodb.net/cafe'
    urlDB=process.env.MONGO_URI
}
process.env.URLDB=urlDB;

//* Google client ID

process.env.CLIENT_ID=process.env.CLIENT_ID || '1058223942716-qpr4dtolum6mm518aqptbhhmgt9l0ivq.apps.googleusercontent.com';