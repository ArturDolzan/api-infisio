'use strict'

const { Model, ref } = require('objection')
const { ModelBase } = require('../base/modelBase')
const { ContasTenant } = require('../infra/contasTenant')

class LocaisReuniao extends ModelBase {
  
  constructor(){
    super()
  }

  static get getNovo() {
    return {
        id: undefined,
        idtenant: undefined,
        descricao: undefined,        
        ativo: undefined,
        conflita_horario: undefined
    }
  }

  static get tableName() {
    return 'locais_reuniao'
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
          from: 'locais_reuniao.idtenant',
          to: 'contas_tenant.idtenant'
        }
      },
    }
  }

  static get getCamposFiltros() {
    return [
      { campo: 'descricao', type: 'string'},
      { campo: 'id', type: 'integer'}
    ]
  }

}

module.exports = {
    LocaisReuniao
}