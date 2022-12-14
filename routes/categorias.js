const { Router } = require( "express" );
const { check } = require("express-validator");
const { crearCategoria,
    obtenerCategorias,
    obtenerCategoria, 
    actualizarCategoria,
    borrarCategoria} = require("../controllers/categorias");
const { existeCategoria } = require("../helpers/db-validators");

const { validarJWT, validarCampos, esAdminRole } = require("../middlewares");

const router = Router();

// {{url}}/apì/categorias



// Crear middleware personalizado para validar el id recibido en las
// rutas que soliciten id:

// check('id).custom( existeCategoria );
// Crearlo en los helpers, es parecido a "db-validators"




// Obtener todas las categorias - publico
router.get('/', obtenerCategorias );

// Obtener una categoria por id - publico
router.get('/:id', [
                check('id', 'No es un id de Mongo válido').isMongoId(),
                check('id').custom( existeCategoria ),
                validarCampos
            ], obtenerCategoria);

// Crear categoría - Privado - Cualquier persona con un token válido
router.post('/', [ 
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
  ], crearCategoria );

// Actualizar - Privado - Cualquier persona con un token válido
router.put('/:id', [ 
    validarJWT, 
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeCategoria ),
    validarCampos
], actualizarCategoria);

// Borrar categoria - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeCategoria ),
    validarCampos
], borrarCategoria);

module.exports = router;