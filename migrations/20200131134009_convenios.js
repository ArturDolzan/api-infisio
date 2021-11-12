
exports.up = function(knex, Promise) {
    
    return criarTabelaConvenios()
    .then(rowLevelSecurityPolicy)
    .then(enableLevelSecurityPolicy)
    .then(forceLevelSecurityPolicy)

    function criarTabelaConvenios() {
        
        return knex.schema.createTable('convenios', table => {
            table.increments('id').primary()
            table.integer('idtenant').notNull()
            table.string('nome', 255).notNull()
            table.integer('ativo').notNull().defaultTo(1)
            table.foreign('idtenant').references('contas_tenant.idtenant')
        })
    }

    function rowLevelSecurityPolicy() {

        return knex.raw(`CREATE POLICY P ON convenios USING (idtenant = current_setting('INFISIO.IDTENANT')::integer  )`)
    }

    function enableLevelSecurityPolicy() {

        return knex.raw(`ALTER TABLE convenios enable ROW LEVEL SECURITY`)
    }

    function forceLevelSecurityPolicy() {

        return knex.raw(`ALTER TABLE convenios FORCE ROW LEVEL SECURITY`)
    }
};

exports.down = function(knex, Promise) {
    
    return droparTabelaConvenios()

    function droparTabelaConvenios() {
        
        return knex.schema.dropTableIfExists('convenios')
    }
};
