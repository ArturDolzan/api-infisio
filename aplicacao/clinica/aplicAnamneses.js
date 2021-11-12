'use strict'

const { AplicBase } = require('../base/aplicBase')
const { ServAnamneses } = require('../../service/clinica/servAnamneses')
const { ErrorHandler } = require('../../shared/error/error')

class AplicAnamneses extends AplicBase {

    constructor(amb){                
        const servico = new ServAnamneses(amb)
        super(servico, amb)
    }

    async recuperarPorPaciente(codigoPaciente) {

        let trx = null
        try {
            
            trx = await this.startTransaction()

            let ret = await this.servico.recuperarPorPaciente(codigoPaciente)
            
            await trx.commit()

            return ret

        } catch (err) { 
            trx.rollback(err)           
            throw new ErrorHandler(err.statusCode, err.message)
        }
    }
}

module.exports = {
    AplicAnamneses
}