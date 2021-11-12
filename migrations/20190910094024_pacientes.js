
exports.up = function(knex, Promise) {

    return criarTabelaPacientes()
    .then(rowLevelSecurityPolicy)
    .then(enableLevelSecurityPolicy)
    .then(forceLevelSecurityPolicy)

    function criarTabelaPacientes() {
        
        return knex.schema.createTable('pacientes', table => {
            table.increments('id').primary()
            table.integer('idtenant').notNull()
            table.string('nome').notNull()            
            table.string('cpf')
            table.string('endereco')
            table.string('fone')
            table.string('email')
            table.integer('sexo').notNull()
            table.timestamp('data_nascimento', {useTz: true})
            table.timestamp('data_cadastro', { precision: 6, useTz: true }).defaultTo(knex.fn.now(6))
            table.integer('ativo').notNull().defaultTo(1)
            table.foreign('idtenant').references('contas_tenant.idtenant')
        })
    }

    function rowLevelSecurityPolicy() {

        return knex.raw(`CREATE POLICY P ON pacientes USING (idtenant = current_setting('INFISIO.IDTENANT')::integer  )`)
    }

    function enableLevelSecurityPolicy() {

        return knex.raw(`ALTER TABLE pacientes enable ROW LEVEL SECURITY`)
    }

    function forceLevelSecurityPolicy() {

        return knex.raw(`ALTER TABLE pacientes FORCE ROW LEVEL SECURITY`)
    }
  
};

exports.down = function(knex, Promise) {
  
    return droparTabelaPacientes()

    function droparTabelaPacientes() {
        
        return knex.schema.dropTableIfExists('pacientes')
    }
};
