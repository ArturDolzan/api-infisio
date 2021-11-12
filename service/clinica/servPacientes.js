'use strict'

const { ServBase } = require('../../service/base/servBase')
const { Pacientes } = require('../../model/clinica/pacientes')
const { ErrorHandler } = require('../../shared/error/error')
const pacienteSchema = require('../../model/mongodb/pacientesMongodb')
const pacienteAnexosSchema = require('../../model/mongodb/pacientesAnexosMongodb')
const mongoose = require('mongoose')
const fs = require('fs')
const uuidv1 = require('uuid/v1')


class ServPacientes extends ServBase{
    
    constructor(amb){        
        super(Pacientes, amb)
    }

    async remover(id) {

       const { ServSessoes } = new require('./servSessoes')
       const servSessoes = new ServSessoes(this._amb)

       const existeSessoes = await servSessoes.query().where({idpaciente: id}).transacting(this._model._trx).first()

       if (existeSessoes) throw new ErrorHandler(400, `Não é permitido remover um paciente que possui sessões lançadas`)

       const { ServAnamneses } = new require('./servAnamneses')
       const servAnamneses = new ServAnamneses(this._amb)

       await servAnamneses.query().delete().where({idpaciente: id}).transacting(this._model._trx)

       const { ServPacientesAnexos } = new require('./servPacientesAnexos')
       const servPacientesAnexos = new ServPacientesAnexos(this._amb)

       await servPacientesAnexos.query().delete().where({idpaciente: id}).transacting(this._model._trx)

        const pacientesMongo = mongoose.model('Pacientes', pacienteSchema)

        pacientesMongo.deleteOne({ id }, errorDel => {

            if(errorDel){ 
                throw new ErrorHandler(400, `Erro ao remover imagem. Erro: ${errorDel}`)
            }
        })

        const pacientesAnexosMongo = mongoose.model('PacientesAnexos', pacienteAnexosSchema)

        pacientesAnexosMongo.deleteOne({ id }, errorDel => {

            if(errorDel){ 
                throw new ErrorHandler(400, `Erro ao remover anexo. Erro: ${errorDel}`)
            }
        })
    }

    async salvarImagem(id, file) {

        let registro = await this.query().where({id}).transacting(this._model._trx).first()

        if (!registro) {
            throw new ErrorHandler(400, `Código ${id} não foi encontrado!`)
        }

        const pacientesMongo = mongoose.model('Pacientes', pacienteSchema)

        let fullPath = "files/" + file.filename

        let paciente = new pacientesMongo
        paciente.img.data = fs.readFileSync(file.path)
        paciente.img.contentType = file.mimetype
        paciente.id = id
        paciente.idtenant = registro.idtenant
        paciente.path = fullPath
        paciente.name = file.filename

        pacientesMongo.deleteOne({ id, idtenant: registro.idtenant }, errorDel => {
            
            if(errorDel){ 
                throw new ErrorHandler(400, `Erro ao remover imagem. Erro: ${errorDel}`)
            }

            paciente.save(error => {
                
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

        const pacientesMongo = mongoose.model('Pacientes', pacienteSchema)

        pacientesMongo.find({ id: id, idtenant: registro.idtenant }, ['id','img', 'name'], {sort:{ _id: -1} }, (error, resultado) => {

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
    ServPacientes
}