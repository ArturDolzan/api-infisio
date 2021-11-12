'use strict'

const { ServBase } = require('../../service/base/servBase')
const { Clinicas } = require('../../model/clinica/clinicas')
const { ErrorHandler } = require('../../shared/error/error')

class ServClinicas extends ServBase{
    
    constructor(amb){        
        super(Clinicas, amb)
    }
}

module.exports = {
    ServClinicas
}