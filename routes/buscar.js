const { Router } = require('express');
const { buscar } = require('../controllers/buscar');

router = new Router();

router.get('/:coleccion/:termino', buscar);

module.exports = router;