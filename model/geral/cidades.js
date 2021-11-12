'use strict'

const { ModelBase } = require('../base/modelBase')

class Cidades extends ModelBase {
  
  constructor(){
    super()
  }

  static get getNovo() {
    return {
      id: undefined,
      nome: undefined,
      idestado: undefined
    }
  }

  static get tableName() {
    return 'cidades'
  }

  static get idColumn() {
    return 'id'
  }

  static get isTenantSpecific() {
    return false
  }

}

module.exports = {
    Cidades
}