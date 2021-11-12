const mongoose = require('mongoose')

const pacienteAnexosSchema = new mongoose.Schema({
    id:  { type: String },
    idtenant:  { type: String },
    arquivo: { data: Buffer, contentType: String },
    path:  { type: String },
    name: { type: String },
    originalName : { type: String }
})

module.exports = pacienteAnexosSchema
