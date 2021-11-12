'use strict'

const { ServBase } = require('../../service/base/servBase')
const { LocaisReuniao } = require('../../model/configuracoes/locaisReuniao')
const { ErrorHandler } = require('../../shared/error/error')

class ServLocaisReuniao extends ServBase{
    
    constructor(amb){        
        super(LocaisReuniao, amb)
    }
}

module.exports = {
    ServLocaisReuniao
}