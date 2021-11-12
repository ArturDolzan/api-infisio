
exports.up = function(knex, Promise) {
  
    return alterarTabelaContasTenant()

    function alterarTabelaContasTenant() {
        
        return knex.schema.table('contas_tenant', table => {
            table.integer('idagente')
        })
    }
};

exports.down = function(knex, Promise) {
  
    return droparColunaAgenteContasTenant()

    function droparColunaAgenteContasTenant() {
        
        return knex.schema.table('contas_tenant', table => {
            table.dropColumn('idagente')
        })
    }
};
