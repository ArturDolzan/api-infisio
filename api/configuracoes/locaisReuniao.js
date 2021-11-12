'use strict'

const config = require('../../config/apiUrl')
const router = require('express').Router()
const { ErrorHandler } = require('../../shared/error/error')
const { retSucesso, retSucessoConteudo } = require('../../shared/infra/response')
const passport = require('../../config/passport.js')()
const { AplicLocaisReuniao } = require('../../aplicacao/configuracoes/aplicLocaisReuniao')

router.use((req, res, next) => {
    next()
})
  
router.get(`${config.routeProd}/locaisReuniao/:qtdePagina/:numeroPagina/:filtros`, passport.authenticate(), async (req, res) => {

    let ret = null

    try {
        ret = await new AplicLocaisReuniao(req).listar(req.params)
    } catch (error) {
        return res.status(error.statusCode || 400).json(error.message)
    }

    return res.status(200).json(retSucessoConteudo(`Registros recuperados com sucesso!`, ret))
})

router.post(`${config.routeProd}/locaisReuniao`, passport.authenticate(), async (req, res) => {

    let ret = null

    try {
       ret = await new AplicLocaisReuniao(req).salvar(req.body)
    } catch (error) {
        return res.status(error.statusCode || 400).json(error.message)
    }

    return res.status(200).json(retSucessoConteudo(`Registro salvo com sucesso!`, ret))
})

router.get(`${config.routeProd}/locaisReuniao/:id`, passport.authenticate(), async (req, res) => {

    let ret = null

    try {
        ret = await new AplicLocaisReuniao(req).recuperarPorId(req.params.id)
    } catch (error) {
        return res.status(error.statusCode || 400).json(error.message)
    }

    return res.status(200).json(retSucessoConteudo(`Registro recuperado com sucesso!`, ret))
})

router.delete(`${config.routeProd}/locaisReuniao/:id`, passport.authenticate(), async (req, res) => {

    try {
        await new AplicLocaisReuniao(req).remover(req.params.id)
    } catch (error) {
        return res.status(error.statusCode || 400).json(error.message)
    }

    return res.status(200).json(retSucesso(`Registro removido com sucesso!`))
})

module.exports = router