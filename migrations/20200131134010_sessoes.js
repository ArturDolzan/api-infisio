
exports.up = function(knex, Promise) {
  
    return criarTabelaSessoes()
    .then(rowLevelSecurityPolicy)
    .then(enableLevelSecurityPolicy)
    .then(forceLevelSecurityPolicy)

    function criarTabelaSessoes() {
        
        return knex.schema.createTable('sessoes', table => {
            table.increments('id').primary()
            table.integer('idtenant').notNull()
            table.string('descricao', 4000).notNull()
            table.timestamp('data_agendamento_inicial', { precision: 6, useTz: true }).defaultTo(knex.fn.now(6))
            table.timestamp('data_agendamento_final', { precision: 6, useTz: true })
            table.integer('situacao').notNull()
            table.integer('idpaciente').notNull()
            table.integer('idagente').notNull()
            table.integer('idconvenio').notNull()
            table.decimal('valor_sessao', 14, 2).notNull().defaultTo(0)            
            table.string('observacao', 4000).notNull()
            table.timestamp('data_cadastro', { precision: 6, useTz: true }).defaultTo(knex.fn.now(6))            
            table.foreign('idtenant').references('contas_tenant.idtenant')
            table.foreign('idpaciente').references('pacientes.id')
            table.foreign('idagente').references('agentes.id')
            table.foreign('idconvenio').references('convenios.id')
        })
    }

    function rowLevelSecurityPolicy() {

        return knex.raw(`CREATE POLICY P ON sessoes USING (idtenant = current_setting('INFISIO.IDTENANT')::integer  )`)
    }

    function enableLevelSecurityPolicy() {

        return knex.raw(`ALTER TABLE sessoes enable ROW LEVEL SECURITY`)
    }

    function forceLevelSecurityPolicy() {

        return knex.raw(`ALTER TABLE sessoes FORCE ROW LEVEL SECURITY`)
    }
};

exports.down = function(knex, Promise) {
  
    return droparTabelaSessoes()

    function droparTabelaSessoes() {
        
        return knex.schema.dropTableIfExists('sessoes')
    }
};
