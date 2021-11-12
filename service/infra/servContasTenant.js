'use strict'

const { ServBase } = require('../base/servBase')
const { ContasTenant } = require('../../model/infra/contasTenant')
const { InFisioBcrypt } = require('../../shared/auth/inFisioBcrypt')
const { encrypt, decrypt } = require('../../shared/auth/inFisioCrypt')
const { EmailHelper } = require('../../shared/email/emailHelper')
const { enumSimNao } = require('../../model/infra/enums')
const bcrypt = require('bcrypt-nodejs')
const moment = require('moment')
const crypto = require('crypto')
const db = require('../../config/db')
const { authSecret } = require('../../.env')
const jwt = require('jwt-simple')
const { ErrorHandler } = require('../../shared/error/error')
const contasTenantSchema = require('../../model/mongodb/contasTenantMongodb')
const mongoose = require('mongoose')
const fs = require('fs')
const uuidv1 = require('uuid/v1')

class ServContasTenant extends ServBase{
    
    constructor(amb){        
        super(ContasTenant, amb)

        this.inFisioBcrypt = new InFisioBcrypt()
        this.emailHelper = new EmailHelper()
    }

    async signin (req) {

        let payload = null

        if (!req.body.email || !req.body.password) {
            throw new ErrorHandler(400, 'Dados incompletos')
        }

        const contaTenant = await this.query()
            .whereRaw("LOWER(email) = LOWER(?)", req.body.email)
            .transacting(this._model._trx)
            .first()

        if (contaTenant) {

            if (!this.validarEmailVerificado(contaTenant)) {
                throw new ErrorHandler(400, 'Esta conta não foi verificada através de um e-mail válido! Verifique a sua caixa de e-mails, incluindo a caixa de spam')
            }

            const result = bcrypt.compareSync(req.body.password, contaTenant.password)

            if (!result) {
                throw new ErrorHandler(401, 'Usuário ou senha incorretos!')
            }
            
            if (contaTenant.ativa !== enumSimNao.SIM.valor) {
                throw new ErrorHandler(401, 'Esta conta não está ativa! Entre em contato com o suporte...')
            }

            payload = { 
                id: contaTenant.idtenant, 
                idtenant: contaTenant.idtenant, 
                master: true, 
                email: req.body.email,
                idagente: contaTenant.idagente
            }

            return {
                statusCode: 200,                    
                email: contaTenant.email,
                idtenant: contaTenant.idtenant,
                token: jwt.encode(payload, authSecret),
                name: contaTenant.name,
                master: true,
                password: req.body.password,
                id: contaTenant.idtenant,
                idagente: contaTenant.idagente 
            }
         
        }else {

            const agente = await db('agentes')
            .whereRaw("LOWER(email) = LOWER(?) and ativo = 1", req.body.email)
            .transacting(this._model._trx)
            .first()

            if (agente) {

                const contaAgente = await this.query()
                .where({idtenant: agente.idtenant})
                .transacting(this._model._trx)
                .first()

                if (!contaAgente) {
                    throw new ErrorHandler(401, 'Conta tenant não encontrada...')
                }

                if (contaAgente.ativa !== enumSimNao.SIM.valor) {
                    throw new ErrorHandler(401, 'Esta conta não está ativa! Entre em contato com o suporte...')
                }

                const result = bcrypt.compareSync(req.body.password, agente.password)

                if (!result) {
                    throw new ErrorHandler(401, 'Usuário ou senha incorretos!')
                }

                payload = { 
                    id: agente.id, 
                    idtenant: agente.idtenant, 
                    master: false, 
                    email: req.body.email,
                    idagente: agente.id 
                }

                return {
                    statusCode: 200,               
                    email: agente.email,
                    idtenant: agente.idtenant,
                    token: jwt.encode(payload, authSecret),
                    name: agente.nome,
                    master: false,
                    password: req.body.password,
                    id: agente.id,
                    idagente: agente.id  
                }
            
            } else {
                throw new ErrorHandler(400, 'Conta não cadastrada!')
            }
        }
    }

    async iniciarRecuperarSenha (req) {
        
        if (!req.body.email) {
            throw new ErrorHandler(400, 'E-mail não informado')
        }

        const contaTenant = await this.query()
            .whereRaw("LOWER(email) = LOWER(?)", req.body.email)
            .transacting(this._model._trx)
            .first()

        if (contaTenant) {

            let dados = {
                email: req.body.email,
                idtenant: contaTenant.idtenant
            }

           const hashEsqueciSenha = encrypt(Buffer.from(JSON.stringify(dados), 'utf8'))

           await this.query().update({hash_esqueci_minha_senha: null})
             .where({idtenant: contaTenant.idtenant})
             .transacting(this._model._trx)

            return this.emailHelper.esqueciMinhaSenhaEmail(req.body.email, hashEsqueciSenha)

        }else {

            //await this._amb.trx.raw(`set infisio.idtenant = ${tenant.idtenant}`)

            throw new ErrorHandler(401, 'É necessário utilizar a conta de administrador para recuperar a senha...')

            const agente = await db('agentes')
            .whereRaw("LOWER(email) = LOWER(?) and ativo = 1", req.body.email)
            .transacting(this._model._trx)
            .first()

            if (agente) {

                const contaAgente = await this.query()
                .where({idtenant: agente.idtenant})
                .transacting(this._model._trx)
                .first()

                if (!contaAgente) {
                    throw new ErrorHandler(401, 'Conta tenant não encontrada...')
                }

                if (contaAgente.ativa !== enumSimNao.SIM.valor) {
                    throw new ErrorHandler(401, 'Esta conta não está ativa! Entre em contato com o suporte...')
                }

                let dados = {
                    email: req.body.email,
                    idtenant: agente.idtenant
                }
    
               const hashEsqueciSenhaAgente = encrypt(Buffer.from(JSON.stringify(dados), 'utf8'))
               
               await db('agentes').update({hash_esqueci_minha_senha: null})
                 .where({idtenant: contaAgente.idtenant, id: agente.id})
                 .transacting(this._model._trx)
                
                return this.emailHelper.esqueciMinhaSenhaEmail(req.body.email, hashEsqueciSenhaAgente)
            
            } else {
                throw new ErrorHandler(400, 'Conta não cadastrada!')
            }
        }
    }

    async autorizarRecuperarSenha (hash) {

        if (!hash) {
            throw new ErrorHandler(400, 'Hash de recuperar senha não localizada')
        }
        
        const hashDecoded = Buffer.from(hash, 'base64').toString('utf8')

        const hashReady = decrypt(JSON.parse(hashDecoded))

        let dados = JSON.parse(hashReady)

        await this._amb.trx.raw(`set infisio.idtenant = ${dados.idtenant}`)

        const objetoWhere = {
            email: dados.email
        }

        const contaTenant = await this.query()
            .where(objetoWhere)
            .transacting(this._model._trx)
            .first()

        if (contaTenant) {

            return await this.query().update({hash_esqueci_minha_senha: hash})
             .where({idtenant: contaTenant.idtenant})
             .transacting(this._model._trx)
        }else {

            const agente = await db('agentes')
            .where(objetoWhere)
            .transacting(this._model._trx)
            .first()

            if (agente) {

                return await db('agentes').update({hash_esqueci_minha_senha: hash})
                 .where({idtenant: contaTenant.idtenant, id: contaAgente.id})
                 .transacting(this._model._trx)
            } else {
                throw new ErrorHandler(400, 'Conta não cadastrada!')
            }
        }
    }

    async executarRecuperarSenha(obj) {
        
        const objetoWhere = {
            email: obj.email
        }

        const contaTenant = await this.query()
            .where(objetoWhere)
            .transacting(this._model._trx)
            .first()

        if (contaTenant) {

            if (!contaTenant.hash_esqueci_minha_senha) {

                throw new ErrorHandler(400, 'Ainda não foi ativado a recuperação de senha através do seu e-mail. Verifique sua caixa de entrada, incluindo spam')
            }

            const hashTenant = this.inFisioBcrypt.obterHash(obj.password)
            
            return await this.query().update({hash_esqueci_minha_senha: null, password: hashTenant})
             .where({idtenant: contaTenant.idtenant})
             .transacting(this._model._trx)
        }else {

            throw new ErrorHandler(401, 'É necessário utilizar a conta de administrador para recuperar a senha...')

            const agente = await db('agentes')
            .where(objetoWhere)
            .transacting(this._model._trx)
            .first()

            if (agente) {

                if (!agente.hash_esqueci_minha_senha) {

                    throw new ErrorHandler(400, 'Ainda não foi ativado a recuperação de senha através do seu e-mail. Verifique sua caixa de entrada, incluindo spam')
                }
    
                const hashAgente = this.inFisioBcrypt.obterHash(obj.password)
                
                return await db('agentes').update({hash_esqueci_minha_senha: null, password: hashAgente})
                 .where({idtenant: contaTenant.idtenant, id: contaAgente.id})
                 .transacting(this._model._trx)
            } else {
                throw new ErrorHandler(400, 'Conta não cadastrada!')
            }
        }
    }

    async save(req) {

        const { ServCargos } = require('../../service/configuracoes/servCargos')
        const servCargos = new ServCargos(this._amb)

        const { ServAgentes } = require('../../service/clinica/servAgentes')
        const servAgentes = new ServAgentes(this._amb)

        const { ServLocaisReuniao } = require('../../service/configuracoes/servLocaisReuniao')
        const servLocaisReuniao = new ServLocaisReuniao(this._amb)

        if (!req.body.idplano) {
            throw new ErrorHandler(400, 'Plano não informado')
        }
        
        let conta = await this.query().where({
            email: req.body.email
        }).transacting(this._model._trx).first()

        if (conta) {
            throw new ErrorHandler(400, 'Este e-mail já está vinculado a uma conta!')
        }    
        
        const hashS = this.inFisioBcrypt.obterHash(req.body.password)
        const password = hashS

        const secret = req.body.email
        const hashEmail = crypto.createHmac('sha256', secret).update('I love Infisio S2').digest('hex')

        let tenant = await this.query().insert({ email: req.body.email, 
            password, 
            name: req.body.name,
            data_conta: new Date(), 
            idplano: req.body.idplano, 
            ativa: enumSimNao.SIM.valor,
            email_verificado: enumSimNao.NAO.valor,
            hash_verificacao_email: hashEmail,
            data_fim_trial: moment().add(7, 'days').format('YYYY MM DD'),
            valida_data_fim_trial: enumSimNao.NAO.valor
        })
        .returning('idtenant')
        .transacting(this._model._trx)
        
        await this._amb.trx.raw(`set infisio.idtenant = ${tenant.idtenant}`)

        let cargoFisio = await servCargos.query().insert({
            descricao: 'Fisioterapeuta',
            ativo: enumSimNao.SIM.valor,
            idtenant: tenant.idtenant
        })
        .returning('id')
        .transacting(this._model._trx)

        await servCargos.query().insert({
            descricao: 'Secretário (a)',
            ativo: enumSimNao.SIM.valor,
            idtenant: tenant.idtenant
        }).transacting(this._model._trx)

        let novoAgente = await servAgentes.query().insert({
            idtenant: tenant.idtenant,
            nome: req.body.name,
            idcargo: cargoFisio.id,
            email: req.body.email,
            data_cadastro: new Date(),
            ativo: enumSimNao.SIM.valor,
            password
        }).returning('id').transacting(this._model._trx)

        await this.query().update({idagente: novoAgente.id}).where({idtenant: tenant.idtenant}).transacting(this._model._trx)

        await servLocaisReuniao.query().insert({
            descricao: 'Padrão',
            ativo: enumSimNao.SIM.valor,
            conflita_horario: enumSimNao.NAO.valor,
            idtenant: tenant.idtenant
        }).transacting(this._model._trx)

        this.emailHelper.confirmacaoContaEmail(req.body.email, hashEmail)
        
        return req.body.email
    }

    validarEmailVerificado(contaTenant) {
            
        if (contaTenant.email_verificado === enumSimNao.NAO.valor) {
            return false
        }

        return true
    }

    async confirmarEmail(hash) {

        if (!hash) {
            throw new ErrorHandler(400, 'Hash de confirmação de e-mail não localizada')
        }

        const objetoWhere = {
            hash_verificacao_email: hash
        }

        let conta = await this.query().where(objetoWhere).transacting(this._model._trx).first()

        if (!conta) {
            throw new ErrorHandler(400, 'Hash de confirmação de e-mail não vinculada a conta')                
        }

        if (conta.email_verificado === enumSimNao.SIM.valor) {
            throw new ErrorHandler(400, 'Esta conta já foi verificada!')
        }

        await this._model.query().where(objetoWhere).update({
            email_verificado: enumSimNao.SIM.valor
        }).transacting(this._model._trx)
    }

    async salvarImagem(id, file) {

        let registro = await this.query().where({idtenant: id}).transacting(this._model._trx).first()

        if (!registro) {
            throw new ErrorHandler(400, `Código ${id} não foi encontrado!`)
        }

        const contasTenantMongo = mongoose.model('ContasTenant', contasTenantSchema)

        let fullPath = "files/" + file.filename

        let contasTenant = new contasTenantMongo
        contasTenant.img.data = fs.readFileSync(file.path)
        contasTenant.img.contentType = file.mimetype
        contasTenant.idtenant = registro.idtenant
        contasTenant.path = fullPath
        contasTenant.name = file.filename

        contasTenantMongo.deleteOne({ idtenant: registro.idtenant }, errorDel => {

            if(errorDel){ 
                throw new ErrorHandler(400, `Erro ao remover imagem. Erro: ${errorDel}`)
            }

            contasTenant.save(error => {
            
                if(error){ 
                    throw new ErrorHandler(400, `Erro ao salvar imagem. Erro: ${error}`)
                }

                fs.unlinkSync(file.path)

                return true
            });
        })
    }

    async recuperarImagem(id, cb) {
        
        let registro = await this.query().where({idtenant: id}).transacting(this._model._trx).first()

        if (!registro) {
            throw new ErrorHandler(400, `Código ${id} não foi encontrado!`)
        }

        const contasTenantMongo = mongoose.model('ContasTenant', contasTenantSchema)

        contasTenantMongo.find({ idtenant: registro.idtenant }, ['idtenant','img', 'name'], {sort:{ _id: -1} }, (error, resultado) => {

            if(error){
                throw new ErrorHandler(400, `Erro ao recuperar imagem para o id ${id}. Erro: ${error}`)
            }

            if (!resultado[0]) {
                return cb({     
                    caminho: ``               
                })
            }

            const guid = uuidv1() + (resultado[0].img.contentType == `image/png` ? `.png` : '.jpg')

            fs.writeFile(`public/files/${guid}`, resultado[0].img.data,  "binary", function(err) {
                if(err) {
                    throw new ErrorHandler(400, `Erro ao gerar imagem. Erro: ${err}`)
                }

                cb({     
                    caminho: `files/${guid}`               
                })      
            })
        
       })       
    }
}

module.exports = {
    ServContasTenant
}