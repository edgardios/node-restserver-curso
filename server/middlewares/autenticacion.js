const jwt = require('jsonwebtoken');

//=======================
//Verifica Token
//=======================

let verificaToken = (req, res, next) => { //next continua con el programa


    let token = req.get('Authorization');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Error en el Token'
                }
            });
        }
        req.usuario = decoded.usuario;
        next();
    });
};

//=======================
//Verifica AdminRole
//=======================

let verificaAdmin_Role = (req, res, next) => { //next continua con el programa

    let usuario = req.usuario;


    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });

    }
};


//=======================
//Verifica Token para imagen
//=======================

let verificaTokenImg = (req, res, next) => { //next continua con el programa


    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Error en el Token'
                }
            });
        }
        req.usuario = decoded.usuario;
        next();
    });
};


module.exports = {
    verificaToken,
    verificaAdmin_Role,
    verificaTokenImg
}