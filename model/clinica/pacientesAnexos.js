'use strict'

const { Model, ref } = require('objection')
const { ModelBase } = require('../base/modelBase')

class PacientesAnexos extends ModelBase {
  
  constructor(){
    super()
  }

  static get getNovo() {
    return {
        id: undefined,
        idtenant: undefined,
        descricao: undefined,
        data: undefined
    }
  }

  static get tableName() {
    return 'pacientes_anexos'
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
          from: 'pacientes_anexos.idtenant',
          to: 'contas_tenant.idtenant'
        }
      },
      pacientes: {
        relation: Model.HasOneRelation,
        modelClass: require('../clinica/pacientes').Pacientes,
        join: {
          from: 'pacientes_anexos.idpaciente',
          to: 'pacientes.id'
        }
      }
    }
  }
}

module.exports = {
    PacientesAnexos
}