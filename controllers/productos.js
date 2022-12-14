const { Producto } = require('../models');

// Get all productos
const obtenerProductos = async ( req, res) => {
    const query = { estado: true };
    
    // Paginado
    const { limite = 5 , desde = 0} = req.query;
    
    if (isNaN(limite) || isNaN(desde)){
        res.status(400).json({
            msg: "Los valores desde y limite deben ser numeros validos"
        })
    } else {
        // Total + Populate
        const [ total, productos ] = await Promise.all([
            Producto.countDocuments( query ),
            Producto.find( query )
            .populate('usuario', 'nombre')
            .populate('categoria','nombre')
            .skip( Number ( desde ) )
            .limit( Number ( limite ) )
        ]);

        res.status(200).json({
            total,
            productos
        })
    }

}

// Get a producto
const obtenerProducto = async ( req, res ) => {

    const { id } = req.params;

    console.log(id);
    
    const producto = await Producto.findOne({ id, estado: true })
                                    .populate('usuario', 'nombre')
                                    .populate('categoria', 'nombre');
    res.status(200).json( producto );
}   

// Post producto
const crearProducto = async( req, res ) => {

    const { estado, usuario, ...body } = req.body;
    
    body.nombre = body.nombre.toUpperCase();

    // Check si el producto ya existe
    const productoDB = await Producto.findOne({ nombre: body.nombre });
    if ( productoDB ) {
        return res.status(400).json({
            msg: `El producto ${body.nombre} ya existe`
        });
    }

    // Generar la data a guardar
    const data = {
        ...body,
        nombre: body.nombre,
        usuario: req.usuario._id
    }

    const producto = new Producto( data );
    
    // Guardar en DB
    await producto.save();

    res.status(201).json( producto );

}

// Put producto
const actualizarProducto = async ( req, res ) => {

    const { id } = req.params
    const { estado, usuario, ...data } = req.body;
    // const nombre = req.body.nombre.toUpperCase();

    if ( data.nombre ){
        data.nombre = data.nombre.toUpperCase();
    }

    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate( id, data, { new: true } );

    res.json( producto );

}

// Delete producto
const borrarProducto = async ( req, res ) => {

    const { id } = req.params
    const producto = await Producto.findByIdAndUpdate( id, { estado: false } );
        
    if ( producto && producto.estado !== false ) {
        res.json({
            msg: `El producto ${producto.nombre} fue eliminado correctamente`
        })
    } else {
        return res.json({
            msg: "No existe producto para el id ingresado"
        })
    }
}

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}