
const bcryptjs = require("bcryptjs");
const { json } = require("express");
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

const Usuario = require("../models/usuario");

const login = async (req, res) => {

    const { correo, password } = req.body;

    try {

        const usuario = await Usuario.findOne({ correo });
        
        // Verificar si el email existe
        if ( !usuario ){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });
        };

        // Si el usuario está activo
        if ( !usuario.estado ){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            });
        };

        // Verificar contraseña
        const validPass = bcryptjs.compareSync( password, usuario.password);

        if ( !validPass ){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        };

        // Generar JWT
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        })
    } catch ( error ) {
        console.log( error );
        return res.status(500).json({
            msg: "Hablen con el administrador."
        })
    }


}


const googleSignIn = async ( req, res ) => {
    
    const { id_token } = req.body

    try {
        
        const { nombre, img, correo } = await googleVerify( id_token );

        let usuario = await Usuario.findOne({ correo });
        console.log(usuario);

        if ( !usuario ) {
            // Tengo que crearlo
            const data = {
                nombre,
                correo,
                password: 'default_password',
                img,
                google: true,
                // Esto lo agregue porque daba errores
                rol: 'USER_ROLE'
            };

            usuario = new Usuario( data );

            console.log(usuario);

            await usuario.save();
        }

        if ( !usuario.estado ){
            return res.status(401).json({
                msg: 'Hable con el administrador - Usuario bloqueado'
            })
        }

        // Generar JWT
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        })

    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar',
            error
        })
    }

}

module.exports = {
    login,
    googleSignIn
}