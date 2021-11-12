'use strict'

const { Model, ref } = require('objection')
const { ModelBase } = require('../base/modelBase')

class Agentes extends ModelBase {
  
  constructor(){
    super()
  }

  static get getNovo() {
    return {
        id: undefined,
        idtenant: undefined,
        nome: undefined,
        idcargo: undefined,
        cpf: undefined,
        fone: undefined,
        email: undefined,
        data_cadastro: undefined,
        ativo: undefined,
        password: undefined,
        hash_esqueci_minha_senha: undefined
    }
  }

  static get tableName() {
    return 'agentes'
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
          from: 'agentes.idtenant',
          to: 'contas_tenant.idtenant'
        }
      },
      cargos: {
        relation: Model.HasOneRelation,
        modelClass: require('../configuracoes/cargos').Cargos,
        join: {
          from: 'agentes.idcargo',
          to: 'cargos.id'
        }
      },
    }
  }

  static get getCamposFiltros() {
    return [
      { campo: 'nome', type: 'string'},
      { campo: 'email', type: 'string'},
      { campo: 'id', type: 'integer'}
    ]
  }

}

module.exports = {
    Agentes
}