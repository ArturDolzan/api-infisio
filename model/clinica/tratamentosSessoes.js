'use strict'

const { Model, ref } = require('objection')
const { ModelBase } = require('../base/modelBase')

class TratamentosSessoes extends ModelBase {
  
  constructor(){
    super()
  }

  static get getNovo() {
    return {
        id: undefined,
        idtenant: undefined,
        idsessao: undefined,
        idtratamento: undefined
    }
  }

  static get tableName() {
    return 'tratamentos_sessoes'
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
          from: 'tratamentos_sessoes.idtenant',
          to: 'contas_tenant.idtenant'
        }
      },
      sessoes: {
        relation: Model.HasManyRelation,
        modelClass: require('./sessoes').Sessoes,
        join: {
          from: 'tratamentos_sessoes.idsessao',
          to: 'sessoes.id'
        }
      },
      tratamentos: {
        relation: Model.HasManyRelation,
        modelClass: require('./tratamentos').Tratamentos,
        join: {
          from: 'tratamentos_sessoes.idtratamento',
          to: 'tratamentos.id'
        }
      },
    }
  }

}

module.exports = {
    TratamentosSessoes
}