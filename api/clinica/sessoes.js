'use strict'

const config = require('../../config/apiUrl')
const router = require('express').Router()
const { ErrorHandler } = require('../../shared/error/error')
const { retSucesso, retSucessoConteudo } = require('../../shared/infra/response')
const passport = require('../../config/passport.js')()
const { AplicSessoes } = require('../../aplicacao/clinica/aplicSessoes')

router.use((req, res, next) => {
    next()
})
  
router.get(`${config.routeProd}/sessoes/:qtdePagina/:numeroPagina/:filtros`, passport.authenticate(), async (req, res) => {

    let ret = null

    try {
        ret = await new AplicSessoes(req).listar(req.params)
    } catch (error) {
        return res.status(error.statusCode || 400).json(error.message)
    }

    return res.status(200).json(retSucessoConteudo(`Registros recuperados com sucesso!`, ret))
})

router.post(`${config.routeProd}/sessoes`, passport.authenticate(), async (req, res) => {

    let ret = null

    try {
        ret = await new AplicSessoes(req).salvar(req.body)
    } catch (error) {
        return res.status(error.statusCode || 400).json(error.message)
    }

    return res.status(200).json(retSucessoConteudo(`Registro salvo com sucesso!`, ret))
})

router.post(`${config.routeProd}/sessoes/recuperarPeriodo`, passport.authenticate(), async (req, res) => {

    let ret = null

    try {
        ret = await new AplicSessoes(req).recuperarPeriodo(req.body)
    } catch (error) {
        return res.status(error.statusCode || 400).json(error.message)
    }

    return res.status(200).json(retSucessoConteudo(`Registros recuperados com sucesso!`, ret))
})

router.post(`${config.routeProd}/sessoes/recuperarSessoesPorPaciente`, passport.authenticate(), async (req, res) => {

    let ret = null

    try {
        ret = await new AplicSessoes(req).recuperarSessoesPorPaciente(req.body)
    } catch (error) {
        return res.status(error.statusCode || 400).json(error.message)
    }

    return res.status(200).json(retSucessoConteudo(`Registros recuperados com sucesso!`, ret))
})

router.post(`${config.routeProd}/sessoes/concluir`, passport.authenticate(), async (req, res) => {

    try {
        await new AplicSessoes(req).concluirSessao(req.body)
    } catch (error) {
        return res.status(error.statusCode || 400).json(error.message)
    }

    return res.status(200).json(retSucesso(`Sessão concluída com sucesso!`))
})

router.post(`${config.routeProd}/sessoes/cancelar`, passport.authenticate(), async (req, res) => {

    try {
        await new AplicSessoes(req).cancelarSessao(req.body)
    } catch (error) {
        return res.status(error.statusCode || 400).json(error.message)
    }

    return res.status(200).json(retSucesso(`Sessão cancelada com sucesso!`))
})

router.post(`${config.routeProd}/sessoes/lancarEmLote`, passport.authenticate(), async (req, res) => {

    try {
        await new AplicSessoes(req).lancarEmLote(req.body)
    } catch (error) {
        return res.status(error.statusCode || 400).json(error.message)
    }

    return res.status(200).json(retSucesso(`Lote de sessões lançado com sucesso!`))
})

router.get(`${config.routeProd}/sessoes/:id`, passport.authenticate(), async (req, res) => {

    let ret = null

    try {
        ret = await new AplicSessoes(req).recuperarPorId(req.params.id)
    } catch (error) {
        return res.status(error.statusCode || 400).json(error.message)
    }

    return res.status(200).json(retSucessoConteudo(`Registro recuperado com sucesso!`, ret))
})

router.delete(`${config.routeProd}/sessoes/:id`, passport.authenticate(), async (req, res) => {

    try {
        await new AplicSessoes(req).remover(req.params.id)
    } catch (error) {
        return res.status(error.statusCode || 400).json(error.message)
    }

    return res.status(200).json(retSucesso(`Registro removido com sucesso!`))
})

router.post(`${config.routeProd}/sessoes/recuperarDadosGraficoResumoSessoes`, passport.authenticate(), async (req, res) => {

    let ret = null

    try {
        ret = await new AplicSessoes(req).recuperarDadosGraficoResumoSessoes(req.body)
    } catch (error) {
        return res.status(error.statusCode || 400).json(error.message)
    }

    return res.status(200).json(retSucessoConteudo(`Resumo sessões recuperado com sucesso!`, ret))
})

router.post(`${config.routeProd}/sessoes/recuperarDadosTimelineSessoes`, passport.authenticate(), async (req, res) => {

    let ret = null

    try {
        ret = await new AplicSessoes(req).recuperarDadosTimelineSessoes(req.body)
    } catch (error) {
        return res.status(error.statusCode || 400).json(error.message)
    }

    return res.status(200).json(retSucessoConteudo(`Timeline sessões recuperado com sucesso!`, ret))
})

module.exports = router