const config = require('../knexfile.js')
const knex = require('knex')(config)
const { Model } = require('objection')
//const setupPaginator = require('knex-paginator')

Model.knex(knex)

//setupPaginator(knex)

// knex.on( 'query', function( queryData ) {
//     console.log( queryData );
// })

knex.migrate.latest([config])

module.exports = knex