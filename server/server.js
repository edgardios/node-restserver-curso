require('./config/config');

const express = require('express')
    //Conexion a Mongo
const mongoose = require('mongoose');


const app = express();

const bodyParser = require('body-parser'); //Permite obtener los datos dentro de un arreglo para ser entregado a JSON

app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


//Configuracion de rutas
//carga user para que se pueda leer los metodos

app.use(require('./routes/index'));


//Conexion a DB
mongoose.connect(process.env.URLDB, (err, res) => {
    if (err) throw err;
    console.log('Base de datos OnLine');
});

app.listen(process.env.PORT, () => {
    console.log("Escuchando el puerto 3000");
})