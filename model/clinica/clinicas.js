'use strict'

const { Model, ref } = require('objection')
const { ModelBase } = require('../base/modelBase')

class Clinicas extends ModelBase {
  
  constructor(){
    super()
  }

  static get getNovo() {
    return {
        id: undefined,
        idtenant: undefined,
        nome: undefined,        
        razao_social: undefined,
        idestado: undefined,
        idcidade: undefined,
        cep: undefined,
        endereco: undefined,
        fone: undefined,
        cnpj: undefined,
        email: undefined,
        ativo: undefined
    }
  }

  static get tableName() {
    return 'clinicas'
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
          from: 'clinicas.idtenant',
          to: 'contas_tenant.idtenant'
        }
      },
    }
  }

  static get getCamposFiltros() {
    return [
      { campo: 'nome', type: 'string'},
      { campo: 'razao_social', type: 'string'},
      { campo: 'endereco', type: 'string'},
      { campo: 'email', type: 'string'},
      { campo: 'id', type: 'integer'}
    ]
  }

}

module.exports = {
    Clinicas
}