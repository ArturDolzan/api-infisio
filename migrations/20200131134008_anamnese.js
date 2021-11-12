
exports.up = function(knex, Promise) {
    
    return criarTabelaAnamneses()
    .then(rowLevelSecurityPolicy)
    .then(enableLevelSecurityPolicy)
    .then(forceLevelSecurityPolicy)

    function criarTabelaAnamneses() {
        
        return knex.schema.createTable('anamneses', table => {
            table.increments('id').primary()
            table.integer('idtenant').notNull()
            table.integer('idpaciente').notNull()
            table.string('qp', 4000)
            table.string('hda', 4000)
            table.string('ap', 4000)
            table.string('af', 4000)
            table.string('hv', 4000)
            table.string('observacao', 4000)
            table.foreign('idtenant').references('contas_tenant.idtenant')
            table.foreign('idpaciente').references('pacientes.id')
        })
    }

    function rowLevelSecurityPolicy() {

        return knex.raw(`CREATE POLICY P ON anamneses USING (idtenant = current_setting('INFISIO.IDTENANT')::integer  )`)
    }

    function enableLevelSecurityPolicy() {

        return knex.raw(`ALTER TABLE anamneses enable ROW LEVEL SECURITY`)
    }

    function forceLevelSecurityPolicy() {

        return knex.raw(`ALTER TABLE anamneses FORCE ROW LEVEL SECURITY`)
    }
};

exports.down = function(knex, Promise) {
    
    return droparTabelaAnamneses()

    function droparTabelaAnamneses() {
        
        return knex.schema.dropTableIfExists('anamneses')
    }
};
