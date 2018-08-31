const express = require('express');

const bcrypt = require('bcrypt'); //Encripta el password
const jwt = require('jsonwebtoken'); //Nos dara el algoritmo para generar el Token

const { OAuth2Client } = require('google-auth-library'); //Importacion de Google
const client = new OAuth2Client(process.env.CLIENT_ID); //

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

/////Configuraciones de Google

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }

}


app.post('/google', async(req, res) => {


    let token = req.body.idtoken; // Se recive el token

    let googleUser = await verify(token) //Se envia a verificar el token y si funciona generara un objeto llamado googleUser que tendra la informacion del usuario
        .catch(e => { // la funcion verify se puede generar con un await para luego asignar directamente el objeto que retorna a googleUser
            return res.status(403).json({ // en caso de fallar se envia error o token invalido
                ok: false,
                err: e
            })
        })


    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => { //verifica si existe el usuario en la BD

        if (err) {
            return res.status(500).json({ //Internal server error
                ok: false,
                err
            });
        }

        if (usuarioDB) { // Si existe el usuario

            if (usuarioDB.google === false) { //Y no se ha autentificado por Google
                return res.status(400).json({ //Internal server error
                    ok: false,
                    err: {
                        message: 'Debe de usar su autenticacion normal'
                    }
                });
            } else {
                let token = jwt.sign({ //Si se autentifico por google
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            }
        } else {
            /*Es la primera vez que ingresa*/
            //Si el usuario no existe en la BD

            let usuario = new Usuario(); //Crea un nuevo objeto de la clase usuario y se establecen las propiedades
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            //Grabar al usuario en caso de que no este creado
            usuario.save((err, usuarioDB) => { //Envia los datos de usuario y se crea el objeto usuarioDB

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                let token = jwt.sign({ //se genera un nuevo token
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });

            })
        }

    })

});


module.exports = app;