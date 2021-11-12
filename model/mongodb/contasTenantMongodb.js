const mongoose = require('mongoose')

const contasTenantSchema = new mongoose.Schema({
    idtenant:  { type: String },
    img: { data: Buffer, contentType: String },
    path:  { type: String },
    name: { type: String }
})

module.exports = contasTenantSchema