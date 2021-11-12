'use strict'

const { AplicBase } = require('../base/aplicBase')
const { ServConvenios } = require('../../service/configuracoes/servConvenios')

class AplicConvenios extends AplicBase {

    constructor(amb){                
        const servico = new ServConvenios(amb)
        super(servico, amb)
    }
}

module.exports = {
    AplicConvenios
}