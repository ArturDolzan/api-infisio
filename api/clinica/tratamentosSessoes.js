'use strict'

const config = require('../../config/apiUrl')
const router = require('express').Router()
const { ErrorHandler } = require('../../shared/error/error')
const { retSucesso, retSucessoConteudo } = require('../../shared/infra/response')
const passport = require('../../config/passport.js')()
const { AplicTratamentosSessoes } = require('../../aplicacao/clinica/aplicTratamentosSessoes')

router.use((req, res, next) => {
    next()
})
  
router.get(`${config.routeProd}/tratamentosSessoes/:codigoSessao`, passport.authenticate(), async (req, res) => {

    let ret = null

    try {
        ret = await new AplicTratamentosSessoes(req).recuperarPorSessao(req.params)
    } catch (error) {
        return res.status(error.statusCode || 400).json(error.message)
    }

    return res.status(200).json(retSucessoConteudo(`Registros recuperados com sucesso!`, ret))
})

router.post(`${config.routeProd}/tratamentosSessoes`, passport.authenticate(), async (req, res) => {

    let ret = null

    try {
       ret = await new AplicTratamentosSessoes(req).salvar(req.body)
    } catch (error) {
        return res.status(error.statusCode || 400).json(error.message)
    }

    return res.status(200).json(retSucessoConteudo(`Registros salvos com sucesso!`, ret))
})

router.get(`${config.routeProd}/tratamentosSessoes/:id`, passport.authenticate(), async (req, res) => {

    let ret = null

    try {
        ret = await new AplicTratamentosSessoes(req).recuperarPorId(req.params.id)
    } catch (error) {
        return res.status(error.statusCode || 400).json(error.message)
    }

    return res.status(200).json(retSucessoConteudo(`Registro recuperado com sucesso!`, ret))
})

router.delete(`${config.routeProd}/tratamentosSessoes/:id`, passport.authenticate(), async (req, res) => {

    try {
        await new AplicTratamentosSessoes(req).remover(req.params.id)
    } catch (error) {
        return res.status(error.statusCode || 400).json(error.message)
    }

    return res.status(200).json(retSucesso(`Registro removido com sucesso!`))
})

module.exports = router