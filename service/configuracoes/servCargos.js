'use strict'

const { ServBase } = require('../../service/base/servBase')
const { Cargos } = require('../../model/configuracoes/cargos')
const { ServAgentes } = require('../clinica/servAgentes')
const { ErrorHandler } = require('../../shared/error/error')

class ServCargos extends ServBase{
    
    constructor(amb){        
        super(Cargos, amb)

        this.servAgentes = new ServAgentes(amb)
    }

    async remover(id) {

        const existeAgentes = await this.servAgentes.query().where({idcargo: id}).first()

        if (existeAgentes) {
            throw new ErrorHandler(400, `Este cargo está sendo utilizado no cadastro de Usuários, então não é possível remover!`)
        }

        await super.remover(id)
    }
}

module.exports = {
    ServCargos
}