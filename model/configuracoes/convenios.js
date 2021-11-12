'use strict'

const { Model, ref } = require('objection')
const { ModelBase } = require('../base/modelBase')
const { ContasTenant } = require('../infra/contasTenant')

class Convenios extends ModelBase {
  
  constructor(){
    super()
  }

  static get getNovo() {
    return {
        id: undefined,
        idtenant: undefined,
        nome: undefined,        
        ativo: undefined
    }
  }

  static get tableName() {
    return 'convenios'
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
        modelClass: ContasTenant,
        join: {
          from: 'convenios.idtenant',
          to: 'contas_tenant.idtenant'
        }
      },
    }
  }

  static get getCamposFiltros() {
    return [
      { campo: 'nome', type: 'string'},
      { campo: 'id', type: 'integer'}
    ]
  }

}

module.exports = {
    Convenios
}