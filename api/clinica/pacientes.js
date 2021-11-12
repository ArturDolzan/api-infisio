'use strict'

const config = require('../../config/apiUrl')
const router = require('express').Router()
const { ErrorHandler } = require('../../shared/error/error')
const { retSucesso, retSucessoConteudo } = require('../../shared/infra/response')
const passport = require('../../config/passport.js')()
const { AplicPacientes } = require('../../aplicacao/clinica/aplicPacientes')
const upload = require('../../config/uploadConfig')

router.use((req, res, next) => {
    next()
})
  
router.get(`${config.routeProd}/pacientes/:qtdePagina/:numeroPagina/:filtros`, passport.authenticate(), async (req, res) => {

    let ret = null

    try {
        ret = await new AplicPacientes(req).listar(req.params)
    } catch (error) {
        return res.status(error.statusCode || 400).json(error.message)
    }

    return res.status(200).json(retSucessoConteudo(`Registros recuperados com sucesso!`, ret))
})

router.post(`${config.routeProd}/pacientes`, passport.authenticate(), async (req, res) => {

    let ret = null

    try {
        ret = await new AplicPacientes(req).salvar(req.body)
    } catch (error) {
        return res.status(error.statusCode || 400).json(error.message)
    }

    return res.status(200).json(retSucessoConteudo(`Registro salvo com sucesso!`, ret))
})

router.get(`${config.routeProd}/pacientes/:id`, passport.authenticate(), async (req, res) => {

    let ret = null

    try {
        ret = await new AplicPacientes(req).recuperarPorId(req.params.id)
    } catch (error) {
        return res.status(error.statusCode || 400).json(error.message)
    }

    return res.status(200).json(retSucessoConteudo(`Registro recuperado com sucesso!`, ret))
})

router.delete(`${config.routeProd}/pacientes/:id`, passport.authenticate(), async (req, res) => {

    try {
        await new AplicPacientes(req).remover(req.params.id)
    } catch (error) {
        return res.status(error.statusCode || 400).json(error.message)
    }

    return res.status(200).json(retSucesso(`Registro removido com sucesso!`))
})

router.post(`${config.routeProd}/pacientes/salvarImagem/:id`, upload.single('file') , passport.authenticate(), async (req, res) => {
    
    try {
        await new AplicPacientes(req).salvarImagem(req.params.id, req.file)
        
    } catch (error) {
        return res.status(error.statusCode || 400).json(error.message)
    }

    return res.status(200).json(retSucesso(`Registro salvo com sucesso!`))
})

router.get(`${config.routeProd}/pacientes/imagem/:id`, passport.authenticate(), async (req, res) => {

    let ret = null
    
    try {
        ret = await new AplicPacientes(req).recuperarImagem(req.params.id, (caminho) => {
            return res.status(200).json(retSucessoConteudo(`Registro recuperado com sucesso!`, caminho))
        })
        
    } catch (error) {
        return res.status(error.statusCode || 400).json(error.message)
    }
})

module.exports = router