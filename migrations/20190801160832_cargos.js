
exports.up = function(knex, Promise) {
  
    return criarTabelaCargos()
    .then(rowLevelSecurityPolicy)
    .then(enableLevelSecurityPolicy)
    .then(forceLevelSecurityPolicy)

    function criarTabelaCargos() {
        
        return knex.schema.createTable('cargos', table => {
            table.increments('id').primary()
            table.integer('idtenant').notNull()
            table.string('descricao').notNull()
            table.integer('ativo').notNull().defaultTo(1)
            table.foreign('idtenant').references('contas_tenant.idtenant')
        })
    }

    function rowLevelSecurityPolicy() {

        return knex.raw(`CREATE POLICY P ON cargos USING (idtenant = current_setting('INFISIO.IDTENANT')::integer  )`)
    }

    function enableLevelSecurityPolicy() {

        return knex.raw(`ALTER TABLE cargos enable ROW LEVEL SECURITY`)
    }

    function forceLevelSecurityPolicy() {

        return knex.raw(`ALTER TABLE cargos FORCE ROW LEVEL SECURITY`)
    }
};

exports.down = function(knex, Promise) {
  
    return droparTabelaCargos()

    function droparTabelaCargos() {
        
        return knex.schema.dropTableIfExists('cargos')
    }
};
