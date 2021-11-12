'use strict'

const { AplicBase } = require('../base/aplicBase')
const { ServContasTenant } = require('../../service/infra/servContasTenant')
const { ErrorHandler } = require('../../shared/error/error')

class AplicContasTenant extends AplicBase {

    constructor(amb){                
        const servico = new ServContasTenant(amb)
        super(servico, amb)
    }

    async save(req) {

        let trx = null
        try {
            
            trx = await this.startTransaction()

            let ret = await this.servico.save(req)
            
            await trx.commit()

            return ret

        } catch (err) { 
            trx.rollback(err)           
            throw new ErrorHandler(400, `${err.message}`)
        }
    }

    async signin (req) {

        let trx = null
        try {
            
            trx = await this.startTransaction()

            let ret = await this.servico.signin(req)
            
            await trx.commit()

            return ret

        } catch (err) { 
            trx.rollback(err)           
            throw new ErrorHandler(400, `${err.message}`)
        }
    }

    async iniciarRecuperarSenha (req) {

        let trx = null
        try {
            
            trx = await this.startTransaction()

            let ret = await this.servico.iniciarRecuperarSenha(req)
            
            await trx.commit()

            return ret

        } catch (err) { 
            trx.rollback(err)           
            throw new ErrorHandler(400, `${err.message}`)
        }
    }

    async autorizarRecuperarSenha (hash) {

        let trx = null
        try {
            
            trx = await this.startTransaction()

            let ret = await this.servico.autorizarRecuperarSenha(hash)
            
            await trx.commit()

            return ret

        } catch (err) { 
            trx.rollback(err)           
            throw new ErrorHandler(400, `${err.message}`)
        }
    }

    async executarRecuperarSenha(obj) {

        let trx = null
        try {
            
            trx = await this.startTransaction()

            let ret = await this.servico.executarRecuperarSenha(obj)
            
            await trx.commit()

            return ret

        } catch (err) { 
            trx.rollback(err)           
            throw new ErrorHandler(400, `${err.message}`)
        }
    }

    async confirmarEmail(hash) {

        let trx = null
        try {
            
            trx = await this.startTransaction()

            let ret = await this.servico.confirmarEmail(hash)
            
            await trx.commit()

            return ret

        } catch (err) { 
            trx.rollback(err)           
            throw new ErrorHandler(400, `${err.message}`)
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
            throw new ErrorHandler(400, `${err.message}`)
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
            throw new ErrorHandler(400, `${err.message}`)
        }
    }
}

module.exports = {
    AplicContasTenant
}