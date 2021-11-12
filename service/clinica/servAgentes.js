'use strict'

const { ServBase } = require('../../service/base/servBase')
const { Agentes } = require('../../model/clinica/agentes')
const { ErrorHandler } = require('../../shared/error/error')
const { ContasTenant } = require('../../model/infra/contasTenant')
const agenteSchema = require('../../model/mongodb/agentesMongodb')
const mongoose = require('mongoose')
const fs = require('fs')
const uuidv1 = require('uuid/v1')

class ServAgentes extends ServBase{
    
    constructor(amb){        
        super(Agentes, amb)
    }

    listar(params) {

        let query = super.listar(params)

        query.withGraphFetched('cargos')

        return query
    }

    async salvar(req, hash) {

        if (!req.user.master) {
            throw new ErrorHandler(400, 'Sem permissão para esta ação!')
        }

        if (!req.body.password && req.body.id === 0) {
            throw new ErrorHandler(400, 'Senha não informada!')
        }

        if (!req.body.email) {
            throw new ErrorHandler(400, 'E-mail não informado!')
        }

        let conta = null
        
        if (req.body.id) {
           
            conta = await this.query().where({
                id: req.body.id
            }).first()

            if (conta) {
                if (conta.email !== req.body.email){

                    let novaConta = await this.query().where({
                        email: req.body.email
                    }).first()

                    if (novaConta) {
                        throw new ErrorHandler(400, 'Este e-mail já está vinculado a um usuário!')
                    }
                }
            }
        } else {
            
            conta = await this.query().where({
                email: req.body.email
            }).first()

            if (conta) {
                
                throw new ErrorHandler(400, 'Este e-mail já está vinculado a um usuário!')
            }
        }
        
        const contaTenant = await ContasTenant.query()
         .whereRaw("LOWER(email) = LOWER(?)", req.body.email)
         .transacting(this._model._trx)
         .first()

        if (req.body.id) {
            if (contaTenant) {
                if (conta.email !== contaTenant.email) {
                    throw new ErrorHandler(400, 'Este e-mail já está vinculado a uma conta!')
                }
                
            }
        } else {
            if (contaTenant) {
                
                throw new ErrorHandler(400, 'Este e-mail já está vinculado a uma conta!')
            }
        }

         let dados = {...req.body}

         if (dados.id) {
             delete dados.password
         } else {
            dados.password = hash
         }

         return await super.salvar({
            ...dados
        })
    }

    async recuperarPorId(id) {

        let retorno = await super.recuperarPorId(id).transacting(this._model._trx).withGraphFetched('cargos')
        
        delete retorno.password
        delete retorno.hash_esqueci_minha_senha

        return retorno
    }

    async salvarImagem(id, file) {

        let registro = await this.query().where({id}).transacting(this._model._trx).first()

        if (!registro) {
            throw new ErrorHandler(400, `Código ${id} não foi encontrado!`)
        }

        const agentesMongo = mongoose.model('Agentes', agenteSchema)

        let fullPath = "files/" + file.filename

        let agente = new agentesMongo
        agente.img.data = fs.readFileSync(file.path)
        agente.img.contentType = file.mimetype
        agente.id = id
        agente.idtenant = registro.idtenant
        agente.path = fullPath
        agente.name = file.filename

        agentesMongo.deleteOne({ id, idtenant: registro.idtenant }, errorDel => {

            if(errorDel){ 
                throw new ErrorHandler(400, `Erro ao remover imagem. Erro: ${errorDel}`)
            }

            agente.save(error => {
            
                if(error){ 
                    throw new ErrorHandler(400, `Erro ao salvar imagem. Erro: ${error}`)
                }

                fs.unlinkSync(file.path)

                return true
            });
        })
    }

    async recuperarImagem(id, cb) {
        
        let registro = await this.query().where({id}).transacting(this._model._trx).first()

        if (!registro) {
            throw new ErrorHandler(400, `Código ${id} não foi encontrado!`)
        }

        const agentesMongo = mongoose.model('Agentes', agenteSchema)

        agentesMongo.find({ id: id, idtenant: registro.idtenant }, ['id','img', 'name'], {sort:{ _id: -1} }, (error, resultado) => {

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
    ServAgentes
}