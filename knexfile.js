const moment = require('moment')
const types = require('pg').types

types.setTypeParser(1114, str => moment.utc(str).format('DD/MM/YYYY HH:mm:ss'))

module.exports = {

	client: 'postgresql',
	connection: {
		database: 'infisio',
		user: 'infisiotenancy2',
		password: 'usetudo',		
	},	
	pool: {
		min: 0,
		max: 1,
		/*afterCreate: function(connection, callback) {
			connection.query('SET time_zone = timezone;;', function(err) {
			  callback(err, connection);
			});
		  }*/
	 }
};