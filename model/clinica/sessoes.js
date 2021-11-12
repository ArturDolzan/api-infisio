'use strict'

const { Model, ref } = require('objection')
const { ModelBase } = require('../base/modelBase')
const { enumSituacaoSessao } = require('../infra/enums')
const moment = require('moment')

class Sessoes extends ModelBase {
  
  constructor(){
    super()
  }

  static get getNovo() {
    return {
        id: 0,
        idtenant: undefined,
        descricao: undefined,        
        data_agendamento_inicial: moment().format('DD/MM/YYYY hh:mm'),
        data_agendamento_final: moment().format('DD/MM/YYYY hh:mm'),
        situacao: enumSituacaoSessao.AGENDADA.valor,
        idpaciente: undefined,
        idagente: undefined,
        idconvenio: undefined,
        valor_sessao: undefined,
        observacao: undefined,
        data_cadastro: undefined
    }
  }

  static get dadosLoteDto() {
    return {      
      dataInicial: undefined,
      dataFinal: undefined,
      horarioInicial: undefined,
      horarioFinal: undefined,
      gerarSabado: undefined,
      sessao: {
        ...this.getNovo
      }
    }
  }

  static get tableName() {
    return 'sessoes'
  }

  static get idColumn() {
    return 'id'
  }

  static get isTenantSpecific() {
    return true
  }

  static get relationMappings() {
    return {
      contasTenant: {
        relation: Model.HasOneRelation,
        modelClass: require('../infra/contasTenant').ContasTenant,
        join: {
          from: 'sessoes.idtenant',
          to: 'contas_tenant.idtenant'
        }
      },
      pacientes: {
        relation: Model.HasOneRelation,
        modelClass: require('../clinica/pacientes').Pacientes,
        join: {
          from: 'sessoes.idpaciente',
          to: 'pacientes.id'
        }
      },
      agentes: {
        relation: Model.HasOneRelation,
        modelClass: require('../clinica/agentes').Agentes,
        join: {
          from: 'sessoes.idagente',
          to: 'agentes.id'
        }
      },
      convenios: {
        relation: Model.HasOneRelation,
        modelClass: require('../configuracoes/convenios').Convenios,
        join: {
          from: 'sessoes.idconvenio',
          to: 'convenios.id'
        }
      },
      locaisReuniao: {
        relation: Model.HasOneRelation,
        modelClass: require('../configuracoes/locaisReuniao').LocaisReuniao,
        join: {
          from: 'sessoes.idlocalreuniao',
          to: 'locais_reuniao.id'
        }
      },
      tratamentosSessoes: {
        relation: Model.HasManyRelation,
        modelClass: require('../clinica/tratamentosSessoes').TratamentosSessoes,
        join: {
          from: 'sessoes.id',
          to: 'tratamentos_sessoes.idsessao'
        }
      },
    }
  }

  static get getCamposFiltros() {
    return [
      { campo: 'descricao', type: 'string'}
    ]
  }

}

module.exports = {
    Sessoes
}