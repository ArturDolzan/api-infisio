const config = require('../../config/apiUrl')
const router = require('express').Router()
const { authenticate } = require('../../config/passport')
const { ServCidades } = require('../../service/geral/servCidades')

router.use((req, res, next) => {
    next()
})

module.exports = router