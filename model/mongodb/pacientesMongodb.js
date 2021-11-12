const mongoose = require('mongoose')

const pacienteSchema = new mongoose.Schema({
    id:  { type: String },
    idtenant:  { type: String },
    img: { data: Buffer, contentType: String },
    path:  { type: String },
    name: { type: String }
})

module.exports = pacienteSchema
