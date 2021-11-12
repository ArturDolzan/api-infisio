'use strict'

const { AplicBase } = require('../base/aplicBase')
const { ServTratamentosSessoes } = require('../../service/clinica/servTratamentosSessoes')
const { ErrorHandler } = require('../../shared/error/error')

class AplicTratamentosSessoes extends AplicBase {

    constructor(amb){                
        const servico = new ServTratamentosSessoes(amb)
        super(servico, amb)
    }

    async recuperarPorSessao(params) {

        let trx = null
        try {
            
            trx = await this.startTransaction()

            let ret = await this.servico.recuperarPorSessao(params)
            
            await trx.commit()

            return ret

        } catch (err) { 
            trx.rollback(err)           
            throw new ErrorHandler(err.statusCode, err.message)
        }
    }
}

module.exports = {
    AplicTratamentosSessoes
}