'use strict'

const { AplicBase } = require('../base/aplicBase')
const { ServCargos } = require('../../service/configuracoes/servCargos')

class AplicCargos extends AplicBase {

    constructor(amb){                
        const servico = new ServCargos(amb)
        super(servico, amb)
    }
}

module.exports = {
    AplicCargos
}