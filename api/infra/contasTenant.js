const config = require('../../config/apiUrl')
const router = require('express').Router()
const { ErrorHandler } = require('../../shared/error/error')
const { retSucesso, retSucessoConteudo } = require('../../shared/infra/response')
const { authenticate } = require('../../config/passport')
const passport = require('../../config/passport.js')()
const { AplicContasTenant } = require('../../aplicacao/infra/aplicContasTenant')
const upload = require('../../config/uploadConfig')

router.use(function(req, res, next) {
    next()
})
  
router.post(`${config.routeProd}/signin`, async (req, res) => {

    let ret = null

    try {
        ret = await new AplicContasTenant(req).signin(req)
    } catch (error) {
        return res.status(error.statusCode || 400).json(error.message)
    }

    return res.status(200).json(retSucessoConteudo(`Autenticação realizada com sucesso!`, ret))
})

router.post(`${config.routeProd}/iniciarRecuperarSenha`, async (req, res) => {

    let ret = null

    try {
        ret = await new AplicContasTenant(req).iniciarRecuperarSenha(req)
    } catch (error) {
        return res.status(error.statusCode || 400).json(error.message)
    }

    return res.status(200).json(retSucessoConteudo(`Recuperar senha iniciado com sucesso!`, ret))
})

router.post(`${config.routeProd}/executarRecuperarSenha`, async (req, res) => {

    try {
        await new AplicContasTenant(req).executarRecuperarSenha(req.body)
    } catch (error) {
        return res.status(error.statusCode || 400).json(error.message)
    }

    return res.status(200).json(retSucesso(`Nova senha definida com sucesso!`))
})

router.post(`${config.routeProd}/signup`, async (req, res) => {

    let ret = null

    try {
        ret = await new AplicContasTenant(req).save(req)
    } catch (error) {
        return res.status(error.statusCode || 400).json(error.message)
    }

    return res.status(200).json(retSucesso(`Conta processada com sucesso! Um e-mail foi encaminhado para ${ret} para confirmação.`))
})

router.post(`${config.routeProd}/validarToken`, passport.authenticate(), async (req, res) => {

    return res.status(200).json(retSucesso(`Token validado com sucesso!`))
})

router.post(`${config.routeProd}/contasTenant/salvarImagem/:id`, upload.single('file') , passport.authenticate(), async (req, res) => {

    try {
        await new AplicContasTenant(req).salvarImagem(req.params.id, req.file)
        
    } catch (error) {
        return res.status(error.statusCode || 400).json(error.message)
    }

    return res.status(200).json(retSucesso(`Registro salvo com sucesso!`))
})

router.get(`${config.routeProd}/contasTenant/imagem/:id`, passport.authenticate(), async (req, res) => {

    let ret = null

    try {
        ret = await new AplicContasTenant(req).recuperarImagem(req.params.id, (caminho) => {
            return res.status(200).json(retSucessoConteudo(`Registro recuperado com sucesso!`, caminho))
        })
        
    } catch (error) {
        return res.status(error.statusCode || 400).json(error.message)
    }
})

router.get(`${config.routeProd}/ativarConta`, async (req, res) => {

    let html = ` <!DOCTYPE html> `
    html += ` <html> `
    html += ` <head> `
    html += ` <title>Bem-vindo</title> `
    html += ` <meta http-equiv = "refresh" content = "3; url = https://app.infisio.com.br" /> `    
    html += ` </head> `    
    html += ` <body> `

    html += ` <h1>Bem-vindo</h1> `
    html += ` Você será redirecionado para o aplicativo em 3 segundos... `
    
    html += ` </body> `
    html += ` </html> `

    try {
        await new AplicContasTenant(req).confirmarEmail(req.query.hash)
        
    } catch (error) {
        return res.status(error.statusCode || 400).json(error.message)
    }

    return res.send(html)
})

router.get(`${config.routeProd}/recuperarMinhaSenha`, async (req, res) => {

    let html = ` <!DOCTYPE html> `
    html += ` <html> `
    html += ` <head> `
    html += ` <title>Recuperar Senha</title> `
    //html += ` <meta http-equiv = "refresh" content = "3; url = https://app.infisio.com.br" /> `    
    html += ` </head> `    
    html += ` <body> `

    html += ` <h1>Recuperar senha</h1> `
    html += ` Redefinição de senha iniciada. Volte ao InFisio para cadastrar uma nova senha `
    
    html += ` </body> `
    html += ` </html> `

    try {
        let resultado = await new AplicContasTenant(req).autorizarRecuperarSenha(req.query.hash)

        if (!resultado) {
            return res.status(400).json(`Hash de verificação para recuperar e-mail não é válida!`)
        }
        
    } catch (error) {
        return res.status(error.statusCode || 400).json(error.message)
    }

    return res.send(html)
})

module.exports = router