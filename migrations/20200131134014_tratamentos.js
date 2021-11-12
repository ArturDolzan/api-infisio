
exports.up = function(knex, Promise) {
  
    return criarTabelaTratamentos()
    .then(rowLevelSecurityPolicy)
    .then(enableLevelSecurityPolicy)
    .then(forceLevelSecurityPolicy)

    function criarTabelaTratamentos() {
        
        return knex.schema.createTable('tratamentos', table => {
            table.increments('id').primary()
            table.integer('idtenant').notNull()
            table.string('descricao', 4000).notNull()
            table.integer('ativo').notNull().defaultTo(1)
            table.foreign('idtenant').references('contas_tenant.idtenant')
        })
    }

    function rowLevelSecurityPolicy() {

        return knex.raw(`CREATE POLICY P ON tratamentos USING (idtenant = current_setting('INFISIO.IDTENANT')::integer  )`)
    }

    function enableLevelSecurityPolicy() {

        return knex.raw(`ALTER TABLE tratamentos enable ROW LEVEL SECURITY`)
    }

    function forceLevelSecurityPolicy() {

        return knex.raw(`ALTER TABLE tratamentos FORCE ROW LEVEL SECURITY`)
    }
};

exports.down = function(knex, Promise) {
  
    return droparTabelaTratamentos()

    function droparTabelaTratamentos() {
        
        return knex.schema.dropTableIfExists('tratamentos')
    }
};
