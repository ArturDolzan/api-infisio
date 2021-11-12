'use strict'

const { Model, ref } = require('objection')
const { ModelBase } = require('../base/modelBase')
const { Planos } = require('../geral/planos')

class ContasTenant extends ModelBase {
  
  constructor(){
    super()
  }

  static get getNovo() {
    return {
        idtenant: undefined,
        email: undefined,
        name: undefined,
        password: undefined,
        idplano: undefined,
        data_conta: undefined,
        ativa: undefined,
        email_verificado: undefined,
        hash_verificacao_email: undefined,
        data_fim_trial: undefined,
        valida_data_fim_trial: undefined,
        hash_esqueci_minha_senha: undefined
    }
  }

  static get tableName() {
    return 'contas_tenant'
  }

  static get idColumn() {
    return 'idtenant'
  }

  static get isTenantSpecific() {
    return false
  }

  static get relationMappings() {
    return {
      planos: {
        relation: Model.HasOneRelation,
        modelClass: Planos,
        join: {
          from: 'contas_tenant.idplano',
          to: 'planos.id'
        }
      },
    }
  }

}

module.exports = {
    ContasTenant
}