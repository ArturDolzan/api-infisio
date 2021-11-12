'use strict'

const { ErrorHandler } = require('../../shared/error/error')

class ServBase {

    constructor(model, amb){
        
        if (!model) throw new ErrorHandler(400, `Modelo não definido em ServBase`)
        if (!amb) throw new ErrorHandler(400, `Ambiente não definido em ServBase`)

        this._model = model
        this._model.amb = amb
        this._amb = amb
    }

    query() {
        return this._model.modelQuery
    }

    listar(params) {

        if(!params) {
            throw new ErrorHandler(400, 'Parâmetros listar não definidos')
        }

        let {filtros, qtdePagina, numeroPagina} = params

        filtros = JSON.parse(filtros)

        if (!Array.isArray(filtros)) {
            throw new ErrorHandler(400, 'Filtros não é um vetor em listar')
        }

        let query = this.query().transacting(this._model._trx)
        query.andWhere(qbMax => {

            let fields = this._model.getCamposFiltros

            filtros.map((itemFiltro, idxFiltro) => {

                fields.map((item, idx) => {

                    let isNumber = !isNaN(itemFiltro)

                    if (!(!isNumber && item.type !== 'string')) {
                        let valorFiltro = item.type === 'string' ? `%${itemFiltro}%` : `${itemFiltro}`
                        let valorCampo = item.type === 'string' ? `LOWER(${item.campo})` : `${item.campo}`

                        if (idx === 0) {
                            qbMax = qbMax.whereRaw(`${valorCampo} ${item.type === 'string' ? 'like' : '='} LOWER(?)`, `${valorFiltro}`)
                        } else {
                            qbMax = qbMax.orWhere((qB) => qB.orWhereRaw(`${valorCampo} ${item.type === 'string' ? 'like' : '='} ?`, `${valorFiltro}`) )
                        }
                    }              
                })
            })
        })

        const qtdePage = parseInt(qtdePagina)
        const nrPage = parseInt(numeroPagina) - 1

        return query.select().page(nrPage, qtdePage).orderBy('id')
    }

    recuperarPorId(id) {
        
        if (!id) {
            throw new ErrorHandler(400, 'Id não informado em RecuperarPorId')
        }

        return this.query().where({id}).transacting(this._model._trx).first()
    }

    async validarAntesSalvar(obj) {

    }

    async salvar(obj) {

        const { id } = obj

        await this.validarAntesSalvar(obj)

        if (!id) return this.inserir(obj)

        return this.atualizar(obj)
    }

    inserir(obj) {

        delete obj.id

        return this._model.query().insert(obj).returning('id').transacting(this._model._trx)
    }

    atualizar(obj) {
        
        const { id } = obj

        if (!id) {
            throw new ErrorHandler(400, 'Id não informado em atualizar')
        }

        return this._model.query().update(obj).where({id}).returning('id').transacting(this._model._trx)
    }

    remover(id) {
        
        if (!id) {
            throw new ErrorHandler(400, 'Id não informado em remover')
        }

        return this.query().delete().where({id}).transacting(this._model._trx)
    }

}

module.exports = {
    ServBase
}