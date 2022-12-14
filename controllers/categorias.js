
const { Categoria } = require("../models")


const obtenerCategorias = async ( req, res) => {
    const query = { estado: true };
    
    // Paginado
    const { limite = 5 , desde = 0} = req.query;
    
    if (isNaN(limite) || isNaN(desde)){

        res.status(400).json({
            msg: "Los valores desde y limite deben ser numeros validos"
        })
    } else {

        // Total + Populate
        const [ total, categorias ] = await Promise.all([
            Categoria.countDocuments( query ),
            Categoria.find( query )
            .populate('usuario', 'nombre')
            .skip( Number ( desde ) )
            .limit( Number ( limite ) )
        ]);

        res.status(200).json({
            total,
            categorias
        })
    }

}

// obtenerCategoria - populate (investigar) -> hacer relacion del ID con el usuario real

const obtenerCategoria = async ( req, res ) => {

    const { id } = req.params;

    console.log(id);
    
    const categoria = await Categoria.findOne({ id, estado: true })
                                            .populate('usuario', 'nombre')

    res.status(200).json( categoria );
    // try {

    // } catch (error) {
        
    //     return res.status(200).json({
    //         msg: "No existe categoria con el id ingresado"
    //     })
    // }

}   

const crearCategoria = async( req, res) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });

    if ( categoriaDB ) {
        return res.status(400).json({
            msg: `La categoria ${nombre} ya existe`
        });
    }

    // Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria( data );
    
    // Guardar en DB
    await categoria.save();

    res.status(201).json( categoria );
}

// actualizarCategoria - solo nombre, nuevo nombre no debe existir

const actualizarCategoria = async ( req, res ) => {

    const { id } = req.params

    console.log(id);

    const nombre = req.body.nombre.toUpperCase();

    console.log(nombre);

    const existe = await Categoria.findOne({ nombre })

    console.log(existe);

    if ( existe ) {
        return res.status(400).json({
            msg: "Ese nombre ya está en uso para otra categoría"
        });
    } else {

        try {
            const categoria = await Categoria.findByIdAndUpdate( id, { nombre }, { new: true } );

            res.json({
                msg: categoria
            })
        } catch (error) {
            
            return res.status(400).json({
                msg: error.message
            });
        }
    }
}

// borrarCategoria - estado: false

const borrarCategoria = async ( req, res ) => {

    const { id } = req.params

    try {

        const categoria = await Categoria.findByIdAndUpdate( id, { estado: false }, { new: true } );
        
        if ( categoria && categoria.estado !== false ) {
            res.json({
                msg: `La categoria ${categoria.nombre} fue eliminada correctamente`
            })
        } else {
            return res.json({
                msg: "No existe categoria para el id ingresado"
            })
        }
    } catch (error) {

        return res.status(400).json({
            msg: error.message
        });
    }
}

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}