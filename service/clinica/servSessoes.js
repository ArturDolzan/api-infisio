'use strict'

const { ServBase } = require('../../service/base/servBase')
const { Sessoes } = require('../../model/clinica/sessoes')
const { ErrorHandler } = require('../../shared/error/error')
const { enumSituacaoSessao, enumSimNao } = require('../../model/infra/enums')
const { ServTratamentos } = require('./servTratamentos')
const moment = require('moment')
const { andWhereRaw } = require('../../config/db')

class ServSessoes extends ServBase{
    
    constructor(amb){        
        super(Sessoes, amb)
        this.servTratamentos = new ServTratamentos(amb)
    }

    async listar(params) {

        let query = super.listar(params)

        let sessoes = await query.withGraphFetched('[pacientes, agentes, convenios, locaisReuniao, tratamentosSessoes]').transacting(this._model._trx)

        sessoes = await this.recuperarTratamentos(sessoes.results)

        return sessoes
    }

    async salvar(obj) {

        let dadosSessao = null
        let codigoSessao = null
        let tratamentos = [...obj.tratamentosSessoes]
        delete obj.tratamentos
        
        if (!obj.id) {
            delete obj.id

            await this.validarConflitoHorario(obj)

            dadosSessao = await this.query().insert(obj).returning('id').transacting(this._model._trx)
            codigoSessao = dadosSessao.id
        } else {

            let registro = await this.query().where({id: obj.id}).transacting(this._model._trx).first()

            if (!registro) throw new ErrorHandler(400, `Sessão não encontrada!`)

            if (!moment(registro.data_agendamento_inicial, 'DD/MM/YYYY HH:mm').isSame(moment(obj.data_agendamento_inicial, 'DD/MM/YYYY HH:mm'))
                || !moment(registro.data_agendamento_final, 'DD/MM/YYYY HH:mm').isSame(moment(obj.data_agendamento_final, 'DD/MM/YYYY HH:mm'))
                || registro.idlocalreuniao !== obj.idlocalreuniao) {

                await this.validarConflitoHorario(obj)
            }

            dadosSessao = await this.query().update(obj).where({id: obj.id}).returning('id').transacting(this._model._trx).first()
            codigoSessao = obj.id
        }                

        return dadosSessao    
    }

    async validarConflitoHorario(obj) {

        let sql = ` (data_agendamento_inicial between '${obj.data_agendamento_inicial}'::timestamp and '${obj.data_agendamento_final}'::timestamp or `
        sql += ` data_agendamento_final between '${obj.data_agendamento_inicial}'::timestamp and '${obj.data_agendamento_final}'::timestamp) `
        sql += ` and exists (select 1 `
        sql += `                from locais_reuniao lr `
        sql += `               where lr.id  = sessoes.idlocalreuniao `
        sql += `                and lr.conflita_horario = ${enumSimNao.SIM.valor}) `
        sql += ` and situacao = ${enumSituacaoSessao.AGENDADA.valor} `

        let queryExisteReuniao = this.query().whereRaw(sql).transacting(this._model._trx)

        if (obj.id) queryExisteReuniao.whereRaw(`id <> ${obj.id}`)

        let existeReuniao = await queryExisteReuniao.first()

        if (existeReuniao) {
            throw new ErrorHandler(400, `Existem outros agendamentos para este local de reunião, por favor verifique as datas.`)
        }
        
    }

    async recuperarPeriodo(params) {

        const {dataInicial, dataFinal, idagente, idlocalreuniao, recuperarCanceladas} = params

        let query = this.query().whereRaw( `CAST(data_agendamento_inicial AS DATE) >= '${dataInicial}' and CAST(data_agendamento_final AS DATE) <= '${dataFinal}'` ).withGraphFetched('[pacientes, agentes, convenios, locaisReuniao, tratamentosSessoes]')

        if (idagente) query.andWhere({idagente})

        if (idlocalreuniao) query.andWhere({idlocalreuniao})

        if (!recuperarCanceladas) query.andWhereRaw("situacao <> 3")

        let sessoes = await query.transacting(this._model._trx)

        sessoes = await this.recuperarTratamentos(sessoes)

        return sessoes
    }

    async recuperarSessoesPorPaciente(params) {

        const {idpaciente, dataInicial, dataFinal} = params

        let query = this.query()
        .whereRaw( `CAST(data_agendamento_inicial AS DATE) >= '${dataInicial}' and CAST(data_agendamento_final AS DATE) <= '${dataFinal}' and idpaciente = ${idpaciente}` )
        .withGraphFetched('[pacientes, agentes, convenios, locaisReuniao, tratamentosSessoes]')
        .orderBy('data_agendamento_inicial', 'desc')

        let sessoes = await query.transacting(this._model._trx)

        sessoes = await this.recuperarTratamentos(sessoes)

        return sessoes
    }

    async recuperarTratamentos(sessoes) {

        await Promise.all(sessoes.map( async (item, idx) => {
            
            await Promise.all(item.tratamentosSessoes.map( async (itemTratamento, idxTratamento) => {

                const registroTratamento = await this.servTratamentos.query().where({id: itemTratamento.idtratamento}).transacting(this._model._trx).first()

                if (registroTratamento) {
                    itemTratamento.tratamentos = { 
                        id: registroTratamento.id, 
                        descricao: registroTratamento.descricao
                    }
                }                
            }))
        }))

        return sessoes
    }

    async concluirSessao(dto) {

        const {id, observacao} = dto

        let registro = await this.query().where({id}).transacting(this._model._trx).first()

        if (!registro) throw new ErrorHandler(400, `Sessão de código ${id} não encontrada!`)

        if (registro.situacao === enumSituacaoSessao.EXECUTADA.valor) throw new ErrorHandler(400, `Esta sessão já está executada!`)
        
        if (registro.situacao === enumSituacaoSessao.CANCELADA.valor) throw new ErrorHandler(400, `Esta sessão está cancelada. Não é possível executar!`)

        await this.query().update({situacao: enumSituacaoSessao.EXECUTADA.valor, observacao}).where({id}).transacting(this._model._trx)
    }

    async cancelarSessao(dto) {

        const {id, observacao} = dto

        let registro = await this.query().where({id}).transacting(this._model._trx).first()

        if (!registro) throw new ErrorHandler(400, `Sessão de código ${id} não encontrada!`)

        if (registro.situacao === enumSituacaoSessao.CANCELADA.valor) throw new ErrorHandler(400, `Esta sessão já está cancelada!`)
        
        if (registro.situacao === enumSituacaoSessao.EXECUTADA.valor) throw new ErrorHandler(400, `Esta sessão está executada. Não é possível cancelar!`)

        await this.query().update({situacao: enumSituacaoSessao.CANCELADA.valor, observacao}).where({id}).transacting(this._model._trx)
    }

    async lancarEmLote(dto) {

        let weekDay = null,
            day = null

        if (moment(dto.dataInicial, 'DD/MM/YYYY').isSameOrAfter(moment(dto.dataFinal, 'DD/MM/YYYY'))) {
            throw new ErrorHandler(400, `A data final está igual ou maior que a data inicial do lote!`)
        }

        let interval = moment(dto.dataFinal, 'DD/MM/YYYY').diff(moment(dto.dataInicial, 'DD/MM/YYYY'), 'days') + 1

        if (interval <= 0) {
            throw new ErrorHandler(400, `O intervalo entre a data inicial e final devem ter pelo menos 1 (um) dia!`)
        }
        
        for (let i = 0; i < interval; i++) {
            
            day = moment(dto.dataInicial, 'DD/MM/YYYY HH:mm').add(i, 'days')

            weekDay = moment(day, 'DD/MM/YYYY HH:mm').weekday()

            if ((weekDay >= 1 && weekDay <= 5) || (weekDay === 6 && dto.gerarSabado)) {

                let registro = {...dto.sessao}

                registro.data_agendamento_inicial = moment(moment(day).format('DD/MM/YYYY') +  dto.horarioInicial, 'DD/MM/YYYYLT').format('DD/MM/YYYY HH:mm')
                registro.data_agendamento_final = moment(moment(day).format('DD/MM/YYYY') + dto.horarioFinal, 'DD/MM/YYYYLT').format('DD/MM/YYYY HH:mm')

                let novo = await this.salvar(registro)

                let tratamentos = [...registro.tratamentosSessoes]
                
                let dtoTratamentos = {
                    codigoSessao: novo.id,
                    tratamentos: []
                }
        
                tratamentos.map( (item, idx) => {
                    
                    dtoTratamentos.tratamentos.push({
                        idsessao: novo.id,
                        idtratamento: item.id
                    })
                })

                const { ServTratamentosSessoes } = require('../../service/clinica/servTratamentosSessoes')
                const servTratamentosSessoes = new ServTratamentosSessoes(this._amb)

                await servTratamentosSessoes.salvar(dtoTratamentos)
            }
        }
    }

    remover(id) {                
        throw new ErrorHandler(400, 'Não é possível remover uma sessão. Use o recurso de cancelar...')        
    }

    async recuperarDadosGraficoResumoSessoes(dto) {
        
        const {idagente} = dto
       
        if (!idagente) throw new ErrorHandler(400, 'Código agente não encontrado para recuperar dados gráfico de resumo') 

        let qtdeAgendado = await this.query().where({idagente})
            .andWhere({situacao: enumSituacaoSessao.AGENDADA.valor})
            .andWhereRaw( `CAST(data_agendamento_inicial AS DATE) = '${moment().format('DD/MM/YYYY')}'` )
            .count('id', {as: 'quantidade'})
            .transacting(this._model._trx)
            .first()

        let qtdeConcluido = await this.query().where({idagente})
            .andWhere({situacao: enumSituacaoSessao.EXECUTADA.valor})
            .andWhereRaw( `CAST(data_agendamento_inicial AS DATE) = '${moment().format('DD/MM/YYYY')}'` )
            .count('id', {as: 'quantidade'})
            .transacting(this._model._trx)
            .first()

        let qtdeCancelado = await this.query().where({idagente})
            .andWhere({situacao: enumSituacaoSessao.CANCELADA.valor})
            .andWhereRaw( `CAST(data_agendamento_inicial AS DATE) = '${moment().format('DD/MM/YYYY')}'` )
            .count('id', {as: 'quantidade'})
            .transacting(this._model._trx)
            .first()

        return {
            qtdeAgendado: parseInt(qtdeAgendado.quantidade),
            qtdeConcluido: parseInt(qtdeConcluido.quantidade),
            qtdeCancelado: parseInt(qtdeCancelado.quantidade)
        }
    }

    async recuperarDadosTimelineSessoes(dto) {
        
        const {idagente} = dto
        
        if (!idagente) throw new ErrorHandler(400, 'Código agente não encontrado para recuperar dados timeline') 

        let registros = await this.query().where({idagente})
        .andWhereRaw( `CAST(data_agendamento_inicial AS DATE) = '${moment().format('DD/MM/YYYY')}'` )
        .orderBy('data_agendamento_inicial')
        .transacting(this._model._trx)

        let retorno = []

        const { ServPacientes } = require('../../service/clinica/servPacientes')
        const servPacientes = new ServPacientes(this._amb)

        await Promise.all(registros.map( async (item, idx) => {
            
            let paciente = await servPacientes.recuperarPorId(item.idpaciente)
            .transacting(this._model._trx)
            .first()
            
            retorno.push(
                {
                    id: item.id,
                    data_agendamento_inicial: item.data_agendamento_inicial,
                    horario: moment(item.data_agendamento_inicial, 'DD/MM/YYYY HH:mm').format('HH:mm'),
                    nomePaciente: paciente.nome,
                    descricao: item.descricao,
                    situacao: item.situacao
                }
            )

        }))

       return retorno
    }
}

module.exports = {
    ServSessoes
}