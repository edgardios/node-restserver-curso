///====================
///Puerto
///====================
process.env.PORT = process.env.PORT || 3000;

///====================
///entorno
///====================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

///====================
///BD
///====================

let urlDB;

if (process.env.NODE_ENV == 'dev') {

    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = 'mongodb://cafe-user:Edgardo1988@ds237932.mlab.com:37932/cafe'
}

process.env.URLDB = urlDB;