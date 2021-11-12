'use strict'

const config = require('../../config/apiUrl')
const router = require('express').Router()
const { ErrorHandler } = require('../../shared/error/error')
const { retSucesso, retSucessoConteudo } = require('../../shared/infra/response')
const passport = require('../../config/passport.js')()
const { AplicAnamneses } = require('../../aplicacao/clinica/aplicAnamneses')

router.use((req, res, next) => {
    next()
})
  
router.get(`${config.routeProd}/anamneses/:id`, passport.authenticate(), async (req, res) => {

    let ret = null

    try {
        ret = await new AplicAnamneses(req).recuperarPorPaciente(req.params.id)
    } catch (error) {
        return res.status(error.statusCode || 400).json(error.message)
    }

    return res.status(200).json(retSucessoConteudo(`Registro recuperado com sucesso!`, ret))
})

router.post(`${config.routeProd}/anamneses`, passport.authenticate(), async (req, res) => {

    try {
        await new AplicAnamneses(req).salvar(req.body)
    } catch (error) {
        return res.status(error.statusCode || 400).json(error.message)
    }

    return res.status(200).json(retSucesso(`Registro salvo com sucesso!`))
})

module.exports = router