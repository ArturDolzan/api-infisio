'use strict'

const { Model, ref } = require('objection')
const { ModelBase } = require('../base/modelBase')

class Pacientes extends ModelBase {
  
  constructor(){
    super()
  }

  static get getNovo() {
    return {
        id: undefined,
        idtenant: undefined,
        nome: undefined,        
        cpf: undefined,
        endereco: undefined,
        fone: undefined,
        email: undefined,
        sexo: undefined,
        data_nascimento: undefined,
        data_cadastro: undefined,
        ativo: undefined
    }
  }

  static get tableName() {
    return 'pacientes'
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
          from: 'pacientes.idtenant',
          to: 'contas_tenant.idtenant'
        }
      },
    }
  }

  static get getCamposFiltros() {
    return [
      { campo: 'nome', type: 'string'},
      { campo: 'cpf', type: 'string'},
      { campo: 'endereco', type: 'string'},
      { campo: 'email', type: 'string'},
      { campo: 'id', type: 'integer'}
    ]
  }

}

module.exports = {
    Pacientes
}