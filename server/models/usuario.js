const mongoose = require('mongoose'); // mongoose se ocupara para crear los objetos de forma inteleginte y elegante
const uniqueValidator = require('mongoose-unique-validator'); // Se ocupara la ocultar el campo de password cuando retorna JSON

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
}

let Schema = mongoose.Schema;

let usuariSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El mail es obligatorio']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos,
        required: [true, 'El rol es obligatorio']
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

usuariSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

usuariSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });

module.exports = mongoose.model('Usuario', usuariSchema);