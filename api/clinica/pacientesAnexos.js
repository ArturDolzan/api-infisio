'use strict'

const config = require('../../config/apiUrl')
const router = require('express').Router()
const { ErrorHandler } = require('../../shared/error/error')
const { retSucesso, retSucessoConteudo } = require('../../shared/infra/response')
const passport = require('../../config/passport.js')()
const { AplicPacientesAnexos } = require('../../aplicacao/clinica/aplicPacientesAnexos')
const upload = require('../../config/uploadConfig')

router.use((req, res, next) => {
    next()
})

router.get(`${config.routeProd}/pacientesAnexos/:idpaciente`, passport.authenticate(), async (req, res) => {

    let ret = null

    try {
        ret = await new AplicPacientesAnexos(req).recuperarPorPaciente(req.params.idpaciente, (caminho) => {
            
            return res.status(200).json(retSucessoConteudo(`Registros recuperados com sucesso!`, caminho))
        })
        
    } catch (error) {
        return res.status(error.statusCode || 400).json(error.message)
    }
})

router.post(`${config.routeProd}/pacientesAnexos/salvarEdicao`, passport.authenticate(), async (req, res) => {

    try {
        await new AplicPacientesAnexos(req).salvarEdicao(req.body)
    } catch (error) {
        return res.status(error.statusCode || 400).json(error.message)
    }

    return res.status(200).json(retSucesso(`Registro salvo com sucesso!`))
})

router.post(`${config.routeProd}/pacientesAnexos`, upload.single('file'), passport.authenticate(), async (req, res) => {

    let ret = null

    try {
        ret = await new AplicPacientesAnexos(req).salvar(req.body, req.file)
    } catch (error) {
        return res.status(error.statusCode || 400).json(error.message)
    }

    return res.status(200).json(retSucessoConteudo(`Registro salvo com sucesso!`, ret))
})

router.get(`${config.routeProd}/pacientesAnexos/recuperar/:id`, passport.authenticate(), async (req, res) => {

    let ret = null
    
    try {
        ret = await new AplicPacientesAnexos(req).recuperarAnexo(req.params.id, (caminho) => {
            
            return res.status(200).json(retSucessoConteudo(`Registro recuperado com sucesso!`, caminho))
        })
        
    } catch (error) {
        return res.status(error.statusCode || 400).json(error.message)
    }
})

router.delete(`${config.routeProd}/pacientesAnexos/:id`, passport.authenticate(), async (req, res) => {

    try {
        await new AplicPacientesAnexos(req).remover(req.params.id)
    } catch (error) {
        return res.status(error.statusCode || 400).json(error.message)
    }

    return res.status(200).json(retSucesso(`Registro removido com sucesso!`))
})


module.exports = router