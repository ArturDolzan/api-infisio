const enumSimNao = Object.freeze({
    SIM:   {descricao: 'Sim', valor: 1},
    NAO:  {descricao: 'Não', valor: 2}
})

const enumAtivo = Object.freeze({
    SIM:   {descricao: 'Sim', valor: 1},
    NAO:  {descricao: 'Não', valor: 2}
})

const enumSexo = Object.freeze({
    MASCULINO:   {descricao: 'Masculino', valor: 1},
    FEMININO:  {descricao: 'Feminino', valor: 2}
})

const enumSituacaoSessao = Object.freeze({
    AGENDADA:   {descricao: 'Agendada', valor: 1},
    EXECUTADA:  {descricao: 'Executada', valor: 2},
    CANCELADA:  {descricao: 'Cancelada', valor: 3}
})

module.exports = {
    enumAtivo,
    enumSimNao,
    enumSexo,
    enumSituacaoSessao 
}