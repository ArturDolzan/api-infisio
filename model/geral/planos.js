'use strict'

const { ModelBase } = require('../base/modelBase')

class Planos extends ModelBase {
  
  constructor(){
    super()
  }

  static get getNovo() {
    return {
      id: undefined,
      descricao: undefined,
      valor_mensal: undefined,
      ativo: undefined
    }
  }

  static get tableName() {
    return 'planos'
  }

  static get idColumn() {
    return 'id'
  }

  static get isTenantSpecific() {
    return false
  }

}

module.exports = {
    Planos
}