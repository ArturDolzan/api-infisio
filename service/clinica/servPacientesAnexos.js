'use strict'

const { ServBase } = require('../../service/base/servBase')
const { PacientesAnexos } = require('../../model/clinica/pacientesAnexos')
const { ServPacientes } = require('../../service/clinica/servPacientes')
const { ErrorHandler } = require('../../shared/error/error')
const pacienteAnexosSchema = require('../../model/mongodb/pacientesAnexosMongodb')
const mongoose = require('mongoose')
const fs = require('fs')
const uuidv1 = require('uuid/v1')
const { map } = require('bluebird')
const sharp = require('sharp')

class ServPacientesAnexos extends ServBase{
    
    constructor(amb){        
        super(PacientesAnexos, amb)

        this.servPacientes = new ServPacientes(amb)
    }

    async recuperarPorPaciente(idpaciente, cb) {

        let registro = await this.servPacientes.query().where({id: idpaciente}).transacting(this._model._trx).first()

        if (!registro) {
            throw new ErrorHandler(400, `Paciente de código ${idpaciente} não encontrado!`)
        }

        let registros = await this.query().where({idpaciente}).transacting(this._model._trx)

        const pacientesAnexosMongo = mongoose.model('PacientesAnexos', pacienteAnexosSchema)

        let ret = []
        await Promise.all(registros.map( async (item, idx) => {

            let anexo = await pacientesAnexosMongo.findOne({ id: item.id, idtenant: item.idtenant })
            
            if (anexo) {
                
                const guid = uuidv1() + '-' +  anexo.name
                const extensao = anexo.name.split('.').pop()
                
                let arquivo = await fs.writeFileSync(`public/files/${guid}`, anexo.arquivo.data)

                let thumb = null
                if (extensao.toLowerCase() === 'jpeg' || extensao.toLowerCase() === 'jpg' || extensao.toLowerCase() === 'png' ) {
                    thumb = `public/files/thumbnails-${guid}`
                    await sharp(anexo.arquivo.data).resize(200, 200).toFile(thumb)                    
                }                

                ret.push({
                    ...item, 
                    arquivo: `files/${guid}`, 
                    arquivoThumbnail: `files/thumbnails-${guid}`, 
                    extensao,
                    nomeOriginal: anexo.originalName || null
                })
            }
        }))

        cb(ret) 
    }

    remover(id) {

        const pacientesAnexosMongo = mongoose.model('PacientesAnexos', pacienteAnexosSchema)

        pacientesAnexosMongo.deleteOne({ id }, errorDel => {

            if(errorDel){ 
                throw new ErrorHandler(400, `Erro ao remover anexo. Erro: ${errorDel}`)
            }
        })

        return super.remover(id)
    }

    async salvarEdicao(obj) {

        const { id, descricao } = obj
        
        if (!id) throw new ErrorHandler(400, `Id não encontrado na requisição!`)

        let registro = await this.query().where({id}).transacting(this._model._trx).first()

        if (!registro) {
            throw new ErrorHandler(400, `Documento de código ${id} não encontrado!`)
        }

        return await this._model.query().update({descricao}).where({id}).transacting(this._model._trx)
    }

    async salvar(obj, file) {

        const { idpaciente } = obj
        let id = 0

        if (!idpaciente) throw new ErrorHandler(400, `Paciente não encontrado na requisição!`)

        let registro = await this.servPacientes.query().where({id: idpaciente}).transacting(this._model._trx).first()

        if (!registro) {
            throw new ErrorHandler(400, `Paciente de código ${idpaciente} não encontrado!`)
        }

        let novo = await this._model.query().insert(obj).returning('id').transacting(this._model._trx)

        await this.salvarAnexo(novo.id, file)

        return novo
    }

    async salvarAnexo(id, file) {

        let registro = await this.query().where({id}).transacting(this._model._trx).first()

        if (!registro) {
            throw new ErrorHandler(400, `Código ${id} não foi encontrado!`)
        }

        const pacientesAnexosMongo = mongoose.model('PacientesAnexos', pacienteAnexosSchema)

        let fullPath = "files/" + file.filename

        let paciente = new pacientesAnexosMongo
        paciente.arquivo.data = fs.readFileSync(file.path)
        paciente.arquivo.contentType = file.mimetype
        paciente.id = id
        paciente.idtenant = registro.idtenant
        paciente.path = fullPath
        paciente.name = file.filename
        paciente.originalName = file.originalname

        pacientesAnexosMongo.deleteOne({ id, idtenant: registro.idtenant }, errorDel => {
            
            if(errorDel){ 
                throw new ErrorHandler(400, `Erro ao remover anexo. Erro: ${errorDel}`)
            }

            paciente.save(error => {
                
                if(error){ 
                    throw new ErrorHandler(400, `Erro ao salvar anexo. Erro: ${error}`)
                }

                fs.unlinkSync(file.path)

                return true
            });
        })
    }

    async recuperarAnexo(id, cb) {
        
        let registro = await this.query().where({id}).transacting(this._model._trx).first()

        if (!registro) {
            throw new ErrorHandler(400, `Código ${id} não foi encontrado!`)
        }

        const pacientesAnexosMongo = mongoose.model('PacientesAnexos', pacienteAnexosSchema)

        pacientesAnexosMongo.find({ id: id, idtenant: registro.idtenant }, ['id','arquivo', 'name'], {sort:{ _id: -1} }, (error, resultado) => {

            if(error){
                throw new ErrorHandler(400, `Erro ao recuperar anexo para o id ${id}. Erro: ${error}`)
            }

            if (!resultado[0]) {
                return cb({     
                    caminho: ``               
                }) 
            }

            const guid = uuidv1() + '-' + resultado[0].name
            const extensao = resultado[0].name.split('.').pop()

            fs.writeFile(`public/files/${guid}`, resultado[0].arquivo.data,  "binary", async function(err) {
                if(err) {
                    throw new ErrorHandler(400, `Erro ao gerar anexo. Erro: ${err}`)
                }

                let thumb = null
                if (extensao.toLowerCase() === 'jpeg' || extensao.toLowerCase() === 'jpg' || extensao.toLowerCase() === 'png' ) {
                    thumb = `public/files/thumbnails-${guid}`
                    await sharp(resultado[0].arquivo.data).resize(200, 200).toFile(thumb)                    
                }

                cb({     
                    arquivo: `files/${guid}`,
                    arquivoThumbnail: thumb,
                    extensao,
                    nomeOriginal: resultado[0].originalName || null       
                })            
            })
        
       })       
    }
}

module.exports = {
    ServPacientesAnexos
}