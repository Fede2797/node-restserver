const { Router } = require( "express" );
const { check } = require("express-validator");
const { cargarArchivo, 
    actualizarImagen, 
    mostrarImagen, 
    actualizarImagenCloudinary } = require("../controllers/uploads");
const { coleccionesPermitidas } = require("../helpers");
// const { validarArchivo } = require("../middlewares/validar-archivo");

const { validarCampos, validarArchivo } = require("../middlewares");

const router = Router();

router.post('/', cargarArchivo);

router.put('/:coleccion/:id', [
    validarArchivo,
    check('id', 'El id debe ser un ID de mongo válido').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'] ) ),
    validarCampos
],actualizarImagenCloudinary);
// ], actualizarImagen);

router.get('/:coleccion/:id', [
    check('id', 'El id debe ser un ID de mongo válido').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'] ) ),
    validarCampos
], mostrarImagen);

module.exports = router;