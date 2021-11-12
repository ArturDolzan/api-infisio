'use strict'

const { Model, ref } = require('objection')
const { ModelBase } = require('../base/modelBase')
const { Cidades } = require('../geral/cidades')

class Estados extends ModelBase {
  
  constructor(){
    super()
  }

  static get getNovo() {
    return {
      id: undefined,
      name: undefined,
      uf: undefined
    }
  }

  static get tableName() {
    return 'estados'
  }

  static get idColumn() {
    return 'id'
  }

  static get isTenantSpecific() {
    return false
  }

  static get relationMappings() {
    return {
      cidades: {
        relation: Model.HasManyRelation,
        modelClass: Cidades,
        join: {
          from: 'estados.id',
          to: 'cidades.idestado'
        }
      },
    }
  }

}

module.exports = {
    Estados
}