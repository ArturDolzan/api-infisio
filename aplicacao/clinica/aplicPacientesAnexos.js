'use strict'

const { AplicBase } = require('../base/aplicBase')
const { ServPacientesAnexos } = require('../../service/clinica/servPacientesAnexos')
const { ErrorHandler } = require('../../shared/error/error')

class AplicPacientesAnexos extends AplicBase {

    constructor(amb){                
        const servico = new ServPacientesAnexos(amb)
        super(servico, amb)
    }

    async recuperarPorPaciente(idpaciente, cb) {

        let trx = null
        try {
            
            trx = await this.startTransaction()

            let ret = await this.servico.recuperarPorPaciente(idpaciente, cb)
            
            await trx.commit()

            return ret

        } catch (err) { 
            trx.rollback(err)           
            throw new ErrorHandler(err.statusCode, err.message)
        }
    }

    async salvarEdicao(obj) {

        let trx = null
        try {
            
            trx = await this.startTransaction()

            let ret = await this.servico.salvarEdicao(obj)
            
            await trx.commit()

            return ret

        } catch (err) { 
            trx.rollback(err)           
            throw new ErrorHandler(err.statusCode, err.message)
        }
    }

    async salvar(obj, file) {

        let trx = null
        try {
            
            trx = await this.startTransaction()

            let ret = await this.servico.salvar(obj, file)
            
            await trx.commit()

            return ret

        } catch (err) { 
            trx.rollback(err)           
            throw new ErrorHandler(err.statusCode, err.message)
        }
    }
    
    async salvarAnexo(id, file) {

        let trx = null
        try {
            
            trx = await this.startTransaction()

            let ret = await this.servico.salvarAnexo(id, file)
            
            await trx.commit()

            return ret

        } catch (err) { 
            trx.rollback(err)           
            throw new ErrorHandler(err.statusCode, err.message)
        }
    }

    async recuperarAnexo(id, cb) {

        let trx = null
        try {
            
            trx = await this.startTransaction()

            let ret = await this.servico.recuperarAnexo(id, cb)
            
            await trx.commit()

            return ret

        } catch (err) { 
            trx.rollback(err)           
            throw new ErrorHandler(err.statusCode, err.message)
        }
    }
}

module.exports = {
    AplicPacientesAnexos
}