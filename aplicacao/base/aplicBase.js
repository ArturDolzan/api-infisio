'use strict'

const db = require('../../config/db')
const { ErrorHandler } = require('../../shared/error/error')

class AplicBase {

    constructor(servico, amb){
        
        if (!servico) throw new ErrorHandler(400, `Servico não definido em AplicBase`)
        if (!amb) throw new ErrorHandler(400, `Ambiente não definido em AplicBase`)

        this.servico = servico
        this._amb = amb
    }

    promisify (fn) {
         return new Promise((resolve, reject) => fn(resolve).catch(reject).finally((e)=> {            
         }))
    }

    async startTransaction() {
        
        const trx = await this.promisify(db.transaction.bind(db))        
        
        this.servico._model.knex(trx)
        this.servico._trx = trx
        this.servico._model._trx = trx        
        this.servico._amb.trx = trx
        this._amb.trx = trx

        return trx
    }

    async listar(params) {
        
        let trx = null
        try {
            
            trx = await this.startTransaction()

            let ret = await this.servico.listar(params)
            
            await trx.commit()

            return ret

        } catch (err) { 
            trx.rollback(err)           
            throw new ErrorHandler(err.statusCode, err.message)
        }        
    }

    async recuperarPorId(id) {

        let trx = null
        try {
            
            trx = await this.startTransaction()

            let ret = await this.servico.recuperarPorId(id)
            
            await trx.commit()

            return ret

        } catch (err) { 
            trx.rollback(err)           
            throw new ErrorHandler(err.statusCode, err.message)
        }
    }

    async validarAntesSalvar(obj) {

        let trx = null
        try {
            
            trx = await this.startTransaction()

            let ret = await this.servico.validarAntesSalvar(obj)
            
            await trx.commit()

            return ret

        } catch (err) { 
            trx.rollback(err)           
            throw new ErrorHandler(err.statusCode, err.message)
        }
    }

    async salvar(obj) {

        let trx = null
        try {
            
            trx = await this.startTransaction()

            let ret = await this.servico.salvar(obj)
            
            await trx.commit()

            return ret

        } catch (err) { 
            trx.rollback(err)           
            throw new ErrorHandler(err.statusCode, err.message)
        }
    }

    async inserir(obj) {

        let trx = null
        try {
            
            trx = await this.startTransaction()

            let ret = await this.servico.inserir(obj)
            
            await trx.commit()

            return ret

        } catch (err) { 
            trx.rollback(err)           
            throw new ErrorHandler(err.statusCode, err.message)
        }
    }

    async atualizar(obj) {

        let trx = null
        try {
            
            trx = await this.startTransaction()

            let ret = await this.servico.atualizar(obj)
            
            await trx.commit()

            return ret

        } catch (err) { 
            trx.rollback(err)           
            throw new ErrorHandler(err.statusCode, err.message)
        }
    }

    async remover(id) {

        let trx = null
        try {
            
            trx = await this.startTransaction()

            let ret = await this.servico.remover(id)
            
            await trx.commit()

            return ret

        } catch (err) { 
            trx.rollback(err)           
            throw new ErrorHandler(err.statusCode, err.message)
        }
    }
}

module.exports = {
    AplicBase
}