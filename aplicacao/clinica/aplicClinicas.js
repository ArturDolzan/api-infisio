'use strict'

const { AplicBase } = require('../base/aplicBase')
const { ServClinicas } = require('../../service/clinica/servClinicas')

class AplicClinicas extends AplicBase {

    constructor(amb){                
        const servico = new ServClinicas(amb)
        super(servico, amb)
    }
}

module.exports = {
    AplicClinicas
}