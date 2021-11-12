
exports.up = function(knex, Promise) {
    
    return criarTabelaPlanos()
        .then(criarTabelaContasTenant)
        .then(inserirPlanosPadroes)

    function criarTabelaPlanos() {
        
        return knex.schema.createTable('planos', table => {
            table.increments('id').primary()
            table.string('descricao').notNull()
            table.decimal('valor_mensal', 8, 2).notNullable().defaultTo(0)
            table.integer('ativo').notNull().defaultTo(1)
        })
    }

     function criarTabelaContasTenant() {
        
        return knex.schema.createTable('contas_tenant', table => {
            table.increments('idtenant').primary()
            table.string('email').notNull().unique()
            table.string('name').notNull()
            table.string('password').notNull()
            table.integer('idplano').notNull()
            table.timestamp('data_conta', { precision: 6, useTz: true }).defaultTo(knex.fn.now(6))
            table.integer('ativa').notNull().defaultTo(1)
            table.integer('email_verificado').notNull().defaultTo(0)
            table.string('hash_verificacao_email').notNull().unique()
            table.timestamp('data_fim_trial', { precision: 6, useTz: true }).defaultTo(knex.fn.now(6))
            table.integer('valida_data_fim_trial').notNull().defaultTo(0)
            table.string('hash_esqueci_minha_senha')
            table.foreign('idplano').references('planos.id')
        })
    }

    function inserirPlanosPadroes() {
        
        return knex("planos").insert([
            {descricao: "Trial", valor_mensal: 0},
            {descricao: "Premium", valor_mensal: 89.90}
        ]);
    }
};

exports.down = function(knex, Promise) {
    
    return droparTabelaContasTenant()
        .then(droparTabelaPlanos)

    function droparTabelaContasTenant() {
        
        return knex.schema.dropTableIfExists('contas_tenant')
    }

    function droparTabelaPlanos() {
       
        return knex.schema.dropTableIfExists('planos')
    }
};
