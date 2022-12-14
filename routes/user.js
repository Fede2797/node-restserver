
const { Router } = require( "express" );
const { check } = require("express-validator");

// const { validarCampos } = require('../middlewares/validar-campos');
// const { validarJWT } = require("../middlewares/validar-jwt");
// const { esAdminRole, tieneRole } = require("../middlewares/validar-roles");

const { validarCampos,
    validarJWT,
    esAdminRole,
    tieneRole } = require('../middlewares');

const { esRoleValido, emailExiste, existeUsuarioPorId } = require("../helpers/db-validators");

const { userGet, 
    userPut, 
    userPost, 
    userDelete, 
    userPatch } = require("../controllers/users");

const router = Router();

router.get('/', userGet);

router.put('/:id', [
    check('id', 'El ID ingresado no es válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    check('rol').custom( esRoleValido ),
    validarCampos
], userPut);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio y debe contener más de 6 caracteres').isLength( { min: 6 } ),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom( emailExiste ),
    // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),
    
    // Si bien es esRoleValido espera un argumento, como el nombre del argumento que espera es el mismo
    // que el nombre del argumento que le vamos a enviar (rol=rol) se puede omitir el mismo
    // check('rol').custom( (rol) => esRoleValido(rol) ),
    
    check('rol').custom( esRoleValido ),
    validarCampos
], userPost);

router.delete('/:id', [
    validarJWT,
    // esAdminRole,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'El ID ingresado no es válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
], userDelete);

router.patch('/', userPatch);


module.exports = router;