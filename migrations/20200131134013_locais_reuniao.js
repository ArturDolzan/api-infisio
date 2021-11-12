
exports.up = function(knex, Promise) {
  
    return criarTabelaLocaisReuniao()
    .then(alterarTabelaSessoes)
    .then(rowLevelSecurityPolicy)
    .then(enableLevelSecurityPolicy)
    .then(forceLevelSecurityPolicy)

    function criarTabelaLocaisReuniao() {
        
        return knex.schema.createTable('locais_reuniao', table => {
            table.increments('id').primary()
            table.integer('idtenant').notNull()
            table.string('descricao', 4000).notNull()
            table.integer('ativo').notNull().defaultTo(1)
            table.integer('conflita_horario').notNull().defaultTo(2)
            table.foreign('idtenant').references('contas_tenant.idtenant')
        })
    }

    function alterarTabelaSessoes() {
        
        return knex.schema.table('sessoes', table => {
            table.integer('idlocalreuniao').notNull()            
            table.foreign('idlocalreuniao').references('locais_reuniao.id')
        })
    }

    function rowLevelSecurityPolicy() {

        return knex.raw(`CREATE POLICY P ON locais_reuniao USING (idtenant = current_setting('INFISIO.IDTENANT')::integer  )`)
    }

    function enableLevelSecurityPolicy() {

        return knex.raw(`ALTER TABLE locais_reuniao enable ROW LEVEL SECURITY`)
    }

    function forceLevelSecurityPolicy() {

        return knex.raw(`ALTER TABLE locais_reuniao FORCE ROW LEVEL SECURITY`)
    }
};

exports.down = function(knex, Promise) {
  
    return droparTabelaLocaisReuniao()

    function droparTabelaLocaisReuniao() {
        
        return knex.schema.dropTableIfExists('locais_reuniao')
    }
};
