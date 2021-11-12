'use strict'

const config = require('../../config/apiUrl')
const router = require('express').Router()
const { ErrorHandler } = require('../../shared/error/error')
const { retSucesso, retSucessoConteudo } = require('../../shared/infra/response')
const passport = require('../../config/passport.js')()
const { AplicClinicas } = require('../../aplicacao/clinica/aplicClinicas')

router.use((req, res, next) => {
    next()
})
  
router.get(`${config.routeProd}/clinicas/:qtdePagina/:numeroPagina/:filtros`, passport.authenticate(), async (req, res) => {

    let ret = null

    try {
        ret = await new AplicClinicas(req).listar(req.params)
    } catch (error) {
        return res.status(error.statusCode || 400).json(error.message)
    }

    return res.status(200).json(retSucessoConteudo(`Registros recuperados com sucesso!`, ret))
})

router.post(`${config.routeProd}/clinicas`, passport.authenticate(), async (req, res) => {

    let ret = null

    try {
        ret = await new AplicClinicas(req).salvar(req.body)
    } catch (error) {
        return res.status(error.statusCode || 400).json(error.message)
    }

    return res.status(200).json(retSucessoConteudo(`Registro salvo com sucesso!`, ret))
})

router.get(`${config.routeProd}/clinicas/:id`, passport.authenticate(), async (req, res) => {

    let ret = null

    try {
        ret = await new AplicClinicas(req).recuperarPorId(req.params.id)
    } catch (error) {
        return res.status(error.statusCode || 400).json(error.message)
    }

    return res.status(200).json(retSucessoConteudo(`Registro recuperado com sucesso!`, ret))
})

router.delete(`${config.routeProd}/clinicas/:id`, passport.authenticate(), async (req, res) => {

    try {
        await new AplicClinicas(req).remover(req.params.id)
    } catch (error) {
        return res.status(error.statusCode || 400).json(error.message)
    }

    return res.status(200).json(retSucesso(`Registro removido com sucesso!`))
})

module.exports = router