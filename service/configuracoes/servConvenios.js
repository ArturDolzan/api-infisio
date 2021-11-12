'use strict'

const { ServBase } = require('../../service/base/servBase')
const { Convenios } = require('../../model/configuracoes/convenios')
const { ErrorHandler } = require('../../shared/error/error')

class ServConvenios extends ServBase{
    
    constructor(amb){        
        super(Convenios, amb)
    }
}

module.exports = {
    ServConvenios
}