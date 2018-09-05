// const mongoose = require('mongoose'); // mongoose se ocupara para crear los objetos de forma inteleginte y elegante

// const Schema = mongoose.Schema;

// const categoriaSchema = new Schema({
//     descripcion: {
//         type: String,
//         required: [true, 'El nombre es necesario']
//     },

//     estado: {
//         type: boolean,
//         default: true
//     }
// })

// module.exports = mongoose.model('Categoria', categoriaSchema);


const mongoose = require('mongoose')
const Schema = mongoose.Schema;
let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, 'La descripción es obligatoria']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },

});

module.exports = mongoose.model('Categoria', categoriaSchema);