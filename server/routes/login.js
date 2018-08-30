const express = require('express');

const bcrypt = require('bcrypt'); //Encripta el password
const jwt = require('jsonwebtoken'); //Nos dara el algoritmo para generar el Token

const Usuario = require('../models/usuario');

const app = express();


app.post('/login', (req, res) => { // req=> significa request - res=> response

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => { //{email:body.email}-> esto corresponde a que el mail exista
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrecto'
                }
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) { // esta funcion permite validar si la contraseña ingresada es igual a la encriptada
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrecto'
                }
            });
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

    });

});


module.exports = app;