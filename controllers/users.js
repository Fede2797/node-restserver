const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require("../models/usuario");

const userGet = async(req, res = response) => {

    const { limite = 5 , desde = 0} = req.query;
    const query = { estado: true };

    if (isNaN(limite) || isNaN(desde)){
        res.status(400).json({
            msg: "Los valores desde y limite deben ser numeros validos"
        })
    }
    else {

        // Promise.all dispara todas las promesas ingresadas como parámetro de forma simultánea, y devuelve
        // un array de promesas
        const [ total, usuarios ] = await Promise.all([
            Usuario.countDocuments( query ),
            Usuario.find( query )
                .skip( desde )
                .limit( limite )
        ])
    
        res.json({
            total,
            usuarios
        });
    }
}

const userPost = async(req, res = response) => {

    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });

    // Encriptar contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt );

    // Guardar en BD
    await usuario.save();

    res.json({
        usuario
    });
}

const userPut = async(req, res = response) => {

    const id = req.params.id;
    const { _id, password, google, correo, ...resto } = req.body;

    // TODO validar contra base de datos el ID
    if ( password ) {
        // Encriptar contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto );

    res.json(usuario);
}

const userDelete = async(req, res = response) => {
    const { id } = req.params

    // Fisicamente lo borramos
    // const usuario = await Usuario.findByIdAndDelete( id );

    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false} );

    res.json({
        usuario
    });
}

const userPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - controller'
    });
}

module.exports = {
    userGet,
    userPut,
    userPost,
    userDelete,
    userPatch
}