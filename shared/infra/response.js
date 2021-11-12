const retSucessoConteudo = (mensagem, conteudo) => {
    return {
        statusCode: 200,
        mensagem,
        conteudo
    }
}

const retSucesso = (mensagem) => {
    return {
        statusCode: 200,
        mensagem
    }
}

module.exports = {
    retSucessoConteudo,
    retSucesso
}