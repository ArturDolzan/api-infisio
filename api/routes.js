const router = require('express').Router()

router.use(require('./geral/estados'))
router.use(require('./geral/cidades'))

router.use(require('./infra/contasTenant'))

router.use(require('./clinica/agentes'))
router.use(require('./clinica/clinicas'))
router.use(require('./clinica/pacientes'))
router.use(require('./clinica/pacientesAnexos'))
router.use(require('./clinica/anamneses'))
router.use(require('./clinica/sessoes'))
router.use(require('./clinica/tratamentos'))
router.use(require('./clinica/tratamentosSessoes'))

router.use(require('./configuracoes/cargos'))
router.use(require('./configuracoes/convenios'))
router.use(require('./configuracoes/locaisReuniao'))

module.exports = router