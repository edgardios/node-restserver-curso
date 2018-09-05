const express = require('express');

const _ = require('underscore');

const app = express();

const Categoria = require('../models/categoria');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
        .populate('usuario', 'nombre email') //Permite cargar informacion y revisa que ID existen en la categoria
        .sort('descripcion')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!categorias) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Categoria.count((err, conteo) => { //Cuenta la cantidad de categorias

                res.json({
                    ok: true,
                    categorias,
                    cuantos: conteo
                })

            });


        })
});

app.get('/categoria/:id', verificaToken, (req, res) => {
    /// Debe entregar solo una categoria
    ///Categoria.findById(...);

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            });
        }

        res.json({
            ok: true,
            categoriaDB
        })
    })
});

app.post('/categoria', verificaToken, (req, res) => {
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    });
});

app.put('/categoria/:id', verificaToken, (req, res) => {
    //actualizar la categoria

    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    }

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }


        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    })

});

app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    //solo un admin puede borrar la categoria

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, CategoriaBorrado) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!CategoriaBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            categoria: CategoriaBorrado,
            message: 'Categoria Borrada'
        });

    });

})

module.exports = app;