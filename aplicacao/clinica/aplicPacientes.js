'use strict'

const { AplicBase } = require('../base/aplicBase')
const { ErrorHandler } = require('../../shared/error/error')
const { ServPacientes } = require('../../service/clinica/servPacientes')
const { transaction } = require('objection')
const db = require('../../config/db')

class AplicPacientes extends AplicBase {

    constructor(amb){                
        const servico = new ServPacientes(amb)
        super(servico, amb)
    }

    async remover(id) {

        let trx = null
        try {
            
            trx = await this.startTransaction()

            await this.servico.remover(id)
            
            await trx.commit()

        } catch (err) {            
            trx.rollback(err)
            throw new ErrorHandler(err.statusCode, err.message)
        }
    }

    async salvarImagem(id, file) {

        let trx = null
        try {
            
            trx = await this.startTransaction()

            let ret = await this.servico.salvarImagem(id, file)
            
            await trx.commit()

            return ret

        } catch (err) { 
            trx.rollback(err)           
            throw new ErrorHandler(err.statusCode, err.message)
        }
    }

    async recuperarImagem(id, cb) {

        let trx = null
        try {
            
            trx = await this.startTransaction()

            let ret = await this.servico.recuperarImagem(id, cb)
            
            await trx.commit()

            return ret

        } catch (err) { 
            trx.rollback(err)           
            throw new ErrorHandler(err.statusCode, err.message)
        }
    }
}

module.exports = {
    AplicPacientes
}