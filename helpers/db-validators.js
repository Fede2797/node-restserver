const { Usuario, 
    Categoria, 
    Role, 
    Producto } = require('../models');

const esRoleValido = async(rol = '') => {
    const existeRol = await Role.findOne({ rol });
    if ( !existeRol ) {
        throw new Error(`El rol ${ rol } no está registrado en la BDD`);
    }
}

const emailExiste = async( correo ) => {
    const existeEmail = await Usuario.findOne({ correo });
    if ( existeEmail ){
        throw new Error(`El correo ${ correo } ya está registrado`);
    }
}

const existeUsuarioPorId = async( id ) => {
    const existeUsuario = await Usuario.findById( id );
    if ( !existeUsuario ){
        throw new Error(`El usuario con ID ${ id } no existe`);
    }
}


// Categorias

const existeCategoria = async( id ) => {
    const exists = await Categoria.findById( id );
    console.log("exists", exists);
    if ( !exists ){
        throw new Error(`La categoría con ID ${ id } no existe`);
    }
}

// Productos

const existeProducto = async( id ) => {
    const exists = await Producto.findById( id );
    console.log("exists", exists);
    if ( !exists ){
        throw new Error(`El producto con ID ${ id } no existe`);
    }
}

// Validar colecciones permitidas
const coleccionesPermitidas = ( coleccion='', colecciones = [] ) => {

    const incluida = colecciones.includes( coleccion );

    if( !incluida ) {
        throw new Error(`La coleccion ${ coleccion } no está permitida - ${ colecciones }`);
    }

    return true;
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoria,
    existeProducto,
    coleccionesPermitidas,
};