
exports.up = function(knex, Promise) {
  
    return criarTabelaPacientesAnexos()
    .then(rowLevelSecurityPolicy)
    .then(enableLevelSecurityPolicy)
    .then(forceLevelSecurityPolicy)

    function criarTabelaPacientesAnexos() {
        
        return knex.schema.createTable('pacientes_anexos', table => {
            table.increments('id').primary()
            table.integer('idtenant').notNull()
            table.string('descricao', 4000).notNull()
            table.integer('idpaciente').notNull()
            table.timestamp('data', { precision: 6, useTz: true }).defaultTo(knex.fn.now(6))            
            table.foreign('idtenant').references('contas_tenant.idtenant')
            table.foreign('idpaciente').references('pacientes.id')
        })
    }

    function rowLevelSecurityPolicy() {

        return knex.raw(`CREATE POLICY P ON pacientes_anexos USING (idtenant = current_setting('INFISIO.IDTENANT')::integer  )`)
    }

    function enableLevelSecurityPolicy() {

        return knex.raw(`ALTER TABLE pacientes_anexos enable ROW LEVEL SECURITY`)
    }

    function forceLevelSecurityPolicy() {

        return knex.raw(`ALTER TABLE pacientes_anexos FORCE ROW LEVEL SECURITY`)
    }
};

exports.down = function(knex, Promise) {
  
    return droparTabelaPacientesAnexos()

    function droparTabelaPacientesAnexos() {
        
        return knex.schema.dropTableIfExists('pacientes_anexos')
    }
};
