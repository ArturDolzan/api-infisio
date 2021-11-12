'use strict'

const { ServBase } = require('../base/servBase')
const { Estados } = require('../../model/geral/estados')

class ServEstados extends ServBase{
    
    constructor(amb){        
        super(Estados, amb)
    }
}

module.exports = {
    ServEstados
}