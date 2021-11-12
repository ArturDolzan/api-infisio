'use strict'

const { ServBase } = require('../../service/base/servBase')
const { TratamentosSessoes } = require('../../model/clinica/tratamentosSessoes')
const { ErrorHandler } = require('../../shared/error/error')
const { Sessoes } = require('../../model/clinica/sessoes')

class ServTratamentosSessoes extends ServBase{
    
    constructor(amb){        
        super(TratamentosSessoes, amb)
    }

    async salvar(obj) {

        // Ex:
        // {
        //     "codigoSessao": 16,
        //     "tratamentos": [
        //       {
        //         "idsessao": 16,
        //         "idtratamento": 1
        //       }
        //     ]
        //   }

        const {codigoSessao, tratamentos} = obj
                  
        const { ServSessoes } = require('../../service/clinica/servSessoes')
        const servSessoes = new ServSessoes(this._amb)

        const { ServTratamentos } = require('../../service/clinica/servTratamentos')
        const servTratamentos = new ServTratamentos(this._amb)

        const registroSessao = await servSessoes.query().where({id: codigoSessao}).first()

        if (!registroSessao) {
            throw new ErrorHandler(400, `Sessão de código ${codigoSessao} não encontrado!`)
        }
    
        await this.query().delete().where({idsessao: codigoSessao})

        await Promise.all(tratamentos.map( async (item, idx) => {

            if (item.idsessao !== codigoSessao) {
                throw new ErrorHandler(400, `Sessão informada no DTO é diferente de alguma versão passada em tratamento, não é possível inserir!`)
            }

            const registroTratamento = await servTratamentos.query().where({id: item.idtratamento}).first()

            if (!registroTratamento) {
                throw new ErrorHandler(400, `Tratamento de código ${item.idtratamento} não encontrado!`)
            }
            
            let registro = await this.query().where({idsessao: item.idsessao, idtratamento: item.idtratamento}).first()
            
            if (registro) {
                throw new ErrorHandler(400, `Não é possível inserir o mesmo tratamento duas vezes em uma única sessão!`)
            }

            await this.query().insert(item)
        }))     
    }

    recuperarPorSessao(params) {

        const {codigoSessao} = params
        
        return this.query().where({idsessao: codigoSessao})
    }
}

module.exports = {
    ServTratamentosSessoes
}