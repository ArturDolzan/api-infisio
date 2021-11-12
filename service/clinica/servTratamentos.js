'use strict'

const { ServBase } = require('../../service/base/servBase')
const { Tratamentos } = require('../../model/clinica/tratamentos')
const { ErrorHandler } = require('../../shared/error/error')

class ServTratamentos extends ServBase{
    
    constructor(amb){        
        super(Tratamentos, amb)
    }
}

module.exports = {
    ServTratamentos
}