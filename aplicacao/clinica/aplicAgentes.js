'use strict'

const { AplicBase } = require('../base/aplicBase')
const { ServAgentes } = require('../../service/clinica/servAgentes')
const { ErrorHandler } = require('../../shared/error/error')

class AplicAgentes extends AplicBase {

    constructor(amb){                
        const servico = new ServAgentes(amb)
        super(servico, amb)
    }

    async salvar(req, hash) {
        
        let trx = null
        try {
            
            trx = await this.startTransaction()

            let ret = await this.servico.salvar(req, hash)
            
            await trx.commit()

            return ret

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
    AplicAgentes
}