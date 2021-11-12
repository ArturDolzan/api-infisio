'use strict'

const { Model, ref } = require('objection')
const { ModelBase } = require('../base/modelBase')

class Anamneses extends ModelBase {
  
  constructor(){
    super()
  }

  static get getNovo() {
    return {
        id: undefined,
        idtenant: undefined,
        idpaciente: undefined,        
        qp: undefined,
        hda: undefined,
        ap: undefined,
        af: undefined,
        hv: undefined,
        observacao: undefined
    }
  }

  static get tableName() {
    return 'anamneses'
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
          from: 'anamneses.idtenant',
          to: 'contas_tenant.idtenant'
        }
      },
    }
  }

}

module.exports = {
    Anamneses
}