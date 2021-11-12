'use strict'

const { AplicBase } = require('../base/aplicBase')
const { ServSessoes } = require('../../service/clinica/servSessoes')
const { ErrorHandler } = require('../../shared/error/error')

class AplicSessoes extends AplicBase {

    constructor(amb){                
        const servico = new ServSessoes(amb)
        super(servico, amb)        
    }

    async salvar(obj) {
        
        let trx = null
        try {
            
            trx = await this.startTransaction()
            
            let tratamentos = [...obj.tratamentosSessoes]

            let novo = await this.servico.salvar(obj)
            
            let dto = {
                codigoSessao: novo.id,
                tratamentos: []
            }
    
            tratamentos.map( (item, idx) => {
                
                dto.tratamentos.push({
                    idsessao: novo.id,
                    idtratamento: item.tratamentos ? item.tratamentos.id : item.id
                })
            })

            const { ServTratamentosSessoes } = require('../../service/clinica/servTratamentosSessoes')
            const servTratamentosSessoes = new ServTratamentosSessoes(this._amb)

            await servTratamentosSessoes.salvar(dto)
            
            await trx.commit()

            return novo

        } catch (err) { 
            trx.rollback(err)           
            throw new ErrorHandler(err.statusCode, err.message)
        }
    }
    
    async recuperarPeriodo(params) {

        let trx = null
        try {
            
            trx = await this.startTransaction()

            let ret = await this.servico.recuperarPeriodo(params)
            
            await trx.commit()

            return ret

        } catch (err) { 
            trx.rollback(err)           
            throw new ErrorHandler(err.statusCode, err.message)
        }
    }

    async recuperarSessoesPorPaciente(params) {

        let trx = null
        try {
            
            trx = await this.startTransaction()

            let ret = await this.servico.recuperarSessoesPorPaciente(params)
            
            await trx.commit()

            return ret

        } catch (err) { 
            trx.rollback(err)           
            throw new ErrorHandler(err.statusCode, err.message)
        }
    }

    async concluirSessao(dto) {

        let trx = null
        try {
            
            trx = await this.startTransaction()

            let ret = await this.servico.concluirSessao(dto)
            
            await trx.commit()

            return ret

        } catch (err) { 
            trx.rollback(err)           
            throw new ErrorHandler(err.statusCode, err.message)
        }
    }

    async cancelarSessao(dto) {

        let trx = null
        try {
            
            trx = await this.startTransaction()

            let ret = await this.servico.cancelarSessao(dto)
            
            await trx.commit()

            return ret

        } catch (err) { 
            trx.rollback(err)           
            throw new ErrorHandler(err.statusCode, err.message)
        }
    }

    async lancarEmLote(dto) {

        let trx = null
        try {
            
            trx = await this.startTransaction()
            
            await this.servico.lancarEmLote(dto)
            
            await trx.commit()

        } catch (err) { 
            trx.rollback(err)           
            throw new ErrorHandler(err.statusCode, err.message)
        }
    }

    async recuperarDadosGraficoResumoSessoes(dto) {

        let trx = null
        try {
            
            trx = await this.startTransaction()
            
            let ret = await this.servico.recuperarDadosGraficoResumoSessoes(dto)
            
            await trx.commit()

            return ret

        } catch (err) { 
            trx.rollback(err)           
            throw new ErrorHandler(err.statusCode, err.message)
        }
    }

    async recuperarDadosTimelineSessoes(dto) {

        let trx = null
        try {
            
            trx = await this.startTransaction()
            
            let ret = await this.servico.recuperarDadosTimelineSessoes(dto)
            
            await trx.commit()

            return ret

        } catch (err) { 
            trx.rollback(err)           
            throw new ErrorHandler(err.statusCode, err.message)
        }
    }
}

module.exports = {
    AplicSessoes
}