'use strict'

const { ServBase } = require('../../service/base/servBase')
const { Anamneses } = require('../../model/clinica/anamneses')
const { ErrorHandler } = require('../../shared/error/error')

class ServAnamneses extends ServBase{
    
    constructor(amb){        
        super(Anamneses, amb)
    }

    recuperarPorPaciente(codigoPaciente) {
        return this.query().where({idpaciente: codigoPaciente}).transacting(this._model._trx).first()
    }
}

module.exports = {
    ServAnamneses
}