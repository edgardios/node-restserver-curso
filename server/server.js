require('./config/config');
const express = require('express')
const app = express();

//Conexion a Mongo
const mongoose = require('mongoose');

const bodyParser = require('body-parser'); //Permite obtener los datos dentro de un arreglo para ser entregado a JSON
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//carga user para que se pueda leer

app.use(require('./routes/usuario'));


//Conexion a DB
mongoose.connect(process.env.URLDB, (err, res) => {
    if (err) throw err;
    console.log('Base de datos OnLine');
});

app.listen(process.env.PORT, () => {
    console.log("Escuchando el puerto 3000");
})