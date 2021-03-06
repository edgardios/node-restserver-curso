///====================
///Puerto
///====================
process.env.PORT = process.env.PORT || 3000;

///====================
///entorno
///====================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

///====================
///Vencimiento del token
///====================
//expiresIn: 60-->seg * 60 -->min * 24-->horas *30-->dias
// process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;
process.env.CADUCIDAD_TOKEN = '48h';

///====================
///SEED de autentificacion
///====================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

///====================
///BD
///====================

let urlDB;

if (process.env.NODE_ENV == 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

///====================
///Google Client ID
///====================

process.env.CLIENT_ID = process.env.CLIENT_ID || '383240088387-a47gr80d81gh5h04a7gro480nr3hej8g.apps.googleusercontent.com';