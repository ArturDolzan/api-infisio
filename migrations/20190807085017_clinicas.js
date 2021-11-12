
exports.up = function(knex, Promise) {
  
    return criarTabelaClinicas()
    .then(rowLevelSecurityPolicy)
    .then(enableLevelSecurityPolicy)
    .then(forceLevelSecurityPolicy)

    function criarTabelaClinicas() {
        
        return knex.schema.createTable('clinicas', table => {
            table.increments('id').primary()
            table.integer('idtenant').notNull()
            table.string('nome').notNull()
            table.string('razao_social')
            table.integer('idestado')
            table.integer('idcidade')
            table.string('cep')
            table.string('endereco')
            table.string('fone')
            table.string('cnpj')
            table.string('email')
            table.integer('ativo').notNull().defaultTo(1)
            table.foreign('idtenant').references('contas_tenant.idtenant')
            table.foreign('idestado').references('estados.id')
            table.foreign('idcidade').references('cidades.id')
        })
    }

    function rowLevelSecurityPolicy() {

        return knex.raw(`CREATE POLICY P ON clinicas USING (idtenant = current_setting('INFISIO.IDTENANT')::integer  )`)
    }

    function enableLevelSecurityPolicy() {

        return knex.raw(`ALTER TABLE clinicas enable ROW LEVEL SECURITY`)
    }

    function forceLevelSecurityPolicy() {

        return knex.raw(`ALTER TABLE clinicas FORCE ROW LEVEL SECURITY`)
    }
};

exports.down = function(knex, Promise) {
  
    return droparTabelaClinicas()

    function droparTabelaClinicas() {
        
        return knex.schema.dropTableIfExists('clinicas')
    }
};
