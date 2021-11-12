'use strict'

const { AplicBase } = require('../base/aplicBase')
const { ServTratamentos } = require('../../service/clinica/servTratamentos')

class AplicTratamentos extends AplicBase {

    constructor(amb){                
        const servico = new ServTratamentos(amb)
        super(servico, amb)
    }
}

module.exports = {
    AplicTratamentos
}