const mongoose = require('mongoose')

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/infisio', { useNewUrlParser: true })

module.exports = mongoose