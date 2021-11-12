'use strict'

const express = require('express')
const app = express()
const db = require('./config/db')
const mongoDb = require('./config/dbMongo')
const bodyParser = require('body-parser')
const cors = require('cors')
const passport = require('./config/passport.js')()
const { handleError } = require('./shared/error/error')
const findRemoveSync = require('find-remove')

const routes = require('./api/routes')

app.use(passport.initialize())
app.use(bodyParser.json({limit: '500mb'}))    
app.use(cors({
    origin: '*'
}))

app.use(routes)
app.use((err, req, res, next) => {
    handleError(err, res)
})

process.on('unhandledRejection', (reason, promise) => {
    console.log('Evento captado em:', reason.stack || reason)    
})

app.db = db

app.use('/templatesEmail', express.static('templatesEmail'))
app.use('/files', express.static('public/files'))

setInterval(() => {
    findRemoveSync( __dirname + '/public/files', {age: {seconds: 3600}, dir: "*", files: "*.*"})
}, 360000)

const port = process.env.PORT || 3005

app.listen(port, () => {
    console.log('Backend executando... Porta ' + port)
})

//app.listen(process.env.PORT);