const config = require('../../config/apiUrl')
const router = require('express').Router()
const { authenticate } = require('../../config/passport')
const { ServEstados } = require('../../service/geral/servEstados')

router.use((req, res, next) => {
    next()
})

module.exports = router