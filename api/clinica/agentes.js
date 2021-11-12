'use strict'

const config = require('../../config/apiUrl')
const router = require('express').Router()
const { ErrorHandler } = require('../../shared/error/error')
const { retSucesso, retSucessoConteudo } = require('../../shared/infra/response')
const passport = require('../../config/passport.js')()
const { AplicAgentes } = require('../../aplicacao/clinica/aplicAgentes')
const { InFisioBcrypt } = require('../../shared/auth/inFisioBcrypt')
const upload = require('../../config/uploadConfig')

router.use((req, res, next) => {
    next()
})
  
router.get(`${config.routeProd}/agentes/:qtdePagina/:numeroPagina/:filtros`, passport.authenticate(), async (req, res) => {

    let ret = null

    try {
        ret = await new AplicAgentes(req).listar(req.params)
    } catch (error) {
        return res.status(error.statusCode || 400).json(error.message)
    }

    return res.status(200).json(retSucessoConteudo(`Registros recuperados com sucesso!`, ret))
})

router.post(`${config.routeProd}/agentes`, passport.authenticate(), async (req, res) => {

    try {
        
        let hash = new InFisioBcrypt().obterHash(req.body.password)

        new AplicAgentes(req).salvar(req, hash)
        .then(data => {
            delete data.password
            res.status(200).json(retSucessoConteudo(`Registro salvo com sucesso!`, data))
        })
        .catch(error => res.status(400).json(error.message)) 
        
    } catch (error) {
        return res.status(error.statusCode || 400).json(error.message)
    }

})

router.get(`${config.routeProd}/agentes/:id`, passport.authenticate(), async (req, res) => {

    let ret = null

    try {
        ret = await new AplicAgentes(req).recuperarPorId(req.params.id)
    } catch (error) {
        return res.status(error.statusCode || 400).json(error.message)
    }

    return res.status(200).json(retSucessoConteudo(`Registro recuperado com sucesso!`, ret))
})

router.delete(`${config.routeProd}/agentes/:id`, passport.authenticate(), async (req, res) => {

    try {
        await new AplicAgentes(req).remover(req.params.id)
    } catch (error) {
        return res.status(error.statusCode || 400).json(error.message)
    }

    return res.status(200).json(retSucesso(`Registro removido com sucesso!`))
})

router.post(`${config.routeProd}/agentes/salvarImagem/:id`, upload.single('file') , passport.authenticate(), async (req, res) => {

    try {
        await new AplicAgentes(req).salvarImagem(req.params.id, req.file)
        
    } catch (error) {
        return res.status(error.statusCode || 400).json(error.message)
    }

    return res.status(200).json(retSucesso(`Registro salvo com sucesso!`))
})

router.get(`${config.routeProd}/agentes/imagem/:id`, passport.authenticate(), async (req, res) => {

    let ret = null

    try {
        ret = await new AplicAgentes(req).recuperarImagem(req.params.id, (caminho) => {
            return res.status(200).json(retSucessoConteudo(`Registro recuperado com sucesso!`, caminho))
        })
        
    } catch (error) {
        return res.status(error.statusCode || 400).json(error.message)
    }
})

module.exports = router