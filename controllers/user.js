const { response } = require('express');

const userGet = (req, res = response) => {

    const { q, nombre = "No name", apikey } = req.query;

    res.json({
        ok: true,
        msg: 'get API - controller',
        q,
        nombre,
        apikey
    });
}

const userPut = (req, res = response) => {

    const id = req.params.id;

    res.json({
        ok: true,
        msg: 'put API - controller',
        id
    });
}

const userPost = (req, res = response) => {

    const { nombre, edad } = req.body;

    res.json({
        ok: true,
        msg: 'post API - controller',
        nombre,
        edad
    });
}

const userDelete = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'delete API - controller'
    });
}

const userPatch = (req, res = response) => {
    res.json({
        ok: true,
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