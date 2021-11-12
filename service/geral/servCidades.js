'use strict'

const { ServBase } = require('../base/servBase')
const { Cidades } = require('../../model/geral/cidades')

class ServCidades extends ServBase {
    
    constructor(amb){        
        super(Cidades, amb)
    }
}

module.exports = {
    ServCidades
}