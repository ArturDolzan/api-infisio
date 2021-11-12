'use strict'

const { Model } = require('objection')

class ModelBase extends Model {
    constructor(){
        super()
    }

    static set amb (data) {
        this._amb = data
    }

    static get validarDadosAmbiente() {
        if (!this._amb) throw Error(`Dados ambiente não definidos em ModelBase!`)
    }

    static get getCamposFiltros() {
        
        // Fazer override e atribuir conforme exemplo abaixo
        // Apenas tipo string e integer
        // Exemplo
        // return [
        //     { campo: 'nome', type: 'string'},
        //     { campo: 'email', type: 'string'},
        //     { campo: 'id', type: 'integer'}
        //   ]

        return []
    }

    static get modelQuery() {    
        
        if (this._amb.trx) {            
            this.knex(this._amb.trx)        
        }

        return this
        .query()
        .context({
            onBuild: builder => {        
                
                if (builder._modelClass.isTenantSpecific) {
                    this.validarDadosAmbiente

                    builder.andWhere((qB) => qB.where({ idtenant: this._amb.user.idtenant }))
                }                
            }
        })
    }

    $beforeInsert(context) {

        if (this.__proto__.constructor.isTenantSpecific) {
            if (!this.idtenant) {
                if (!this.constructor._amb) throw Error(`Ambiente não localizado em ModelBase`)
                if (!this.constructor._amb.user.idtenant) throw Error(`Tenant não localizado em ModelBase`)
                this.idtenant = this.constructor._amb.user.idtenant            
            }            
        }
    }
}

module.exports = {
  ModelBase
}