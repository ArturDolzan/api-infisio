'use strict'

const { AplicBase } = require('../base/aplicBase')
const { ServLocaisReuniao } = require('../../service/configuracoes/servLocaisReuniao')

class AplicLocaisReuniao extends AplicBase {

    constructor(amb){                
        const servico = new ServLocaisReuniao(amb)
        super(servico, amb)
    }
}

module.exports = {
    AplicLocaisReuniao
}