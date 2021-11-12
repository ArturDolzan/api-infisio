
exports.up = function(knex, Promise) {
  
    return criarTabelaTratamentosSessoes()
    .then(rowLevelSecurityPolicy)
    .then(enableLevelSecurityPolicy)
    .then(forceLevelSecurityPolicy)

    function criarTabelaTratamentosSessoes() {
        
        return knex.schema.createTable('tratamentos_sessoes', table => {
            table.increments('id').primary()
            table.integer('idtenant').notNull()
            table.integer('idsessao').notNull()
            table.integer('idtratamento').notNull()
            table.foreign('idtenant').references('contas_tenant.idtenant')
            table.foreign('idsessao').references('sessoes.id')
            table.foreign('idtratamento').references('tratamentos.id')
        })
    }

    function rowLevelSecurityPolicy() {

        return knex.raw(`CREATE POLICY P ON tratamentos_sessoes USING (idtenant = current_setting('INFISIO.IDTENANT')::integer  )`)
    }

    function enableLevelSecurityPolicy() {

        return knex.raw(`ALTER TABLE tratamentos_sessoes enable ROW LEVEL SECURITY`)
    }

    function forceLevelSecurityPolicy() {

        return knex.raw(`ALTER TABLE tratamentos_sessoes FORCE ROW LEVEL SECURITY`)
    }
};

exports.down = function(knex, Promise) {
  
    return droparTabelaTratamentosSessoes()

    function droparTabelaTratamentosSessoes() {
        
        return knex.schema.dropTableIfExists('tratamentos_sessoes')
    }
};
