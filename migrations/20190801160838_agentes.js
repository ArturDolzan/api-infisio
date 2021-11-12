
exports.up = function(knex, Promise) {
  
    return criarTabelaAgentes()
    //.then(rowLevelSecurityPolicy)
    //.then(enableLevelSecurityPolicy)
    //.then(forceLevelSecurityPolicy)

    function criarTabelaAgentes() {
        
        return knex.schema.createTable('agentes', table => {
            table.increments('id').primary()
            table.integer('idtenant').notNull()
            table.string('nome').notNull()
            table.integer('idcargo').notNull()
            table.string('cpf')
            table.string('fone')
            table.string('email')
            table.timestamp('data_cadastro', { precision: 6, useTz: true }).defaultTo(knex.fn.now(6))
            table.integer('ativo').notNull().defaultTo(1)
            table.string('password').notNull()
            table.string('hash_esqueci_minha_senha')
            table.foreign('idtenant').references('contas_tenant.idtenant')
            table.foreign('idcargo').references('cargos.id')
        })
    }

    function rowLevelSecurityPolicy() {

        return knex.raw(`CREATE POLICY P ON agentes USING (idtenant = current_setting('INFISIO.IDTENANT')::integer  )`)
    }

    function enableLevelSecurityPolicy() {

        return knex.raw(`ALTER TABLE agentes enable ROW LEVEL SECURITY`)
    }

    function forceLevelSecurityPolicy() {

        return knex.raw(`ALTER TABLE agentes FORCE ROW LEVEL SECURITY`)
    }
};

exports.down = function(knex, Promise) {
  
    return droparTabelaAgentes()

    function droparTabelaAgentes() {
        
        return knex.schema.dropTableIfExists('agentes')
    }
};
