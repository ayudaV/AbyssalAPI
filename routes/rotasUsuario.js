const express = require('express')
const router = express.Router()
const Usuario = require('../models/usuario')
const Ranking = require('../models/ranking')

router.get('/usuarios', async function (req, res) {
    const usuarios = await Usuario.findAll({
        attributes: ['id', 'nomeUsuario', 'createdAt', 'updatedAt']
    })
    res.send(usuarios)
})
router.get('/usuarios/:id', async function (req, res) {
    const usuario = await Usuario.findByPk(req.params.id, {
        attributes: ['id', 'nomeUsuario', 'createdAt', 'updatedAt']
    })
    res.send(usuario)
})
router.get('/usuariosByName/:nome', async function (req, res) {
    const usuario = await Usuario.findOne({
        where: { nomeUsuario: req.params.nome },
        attributes: ['id', 'nomeUsuario', 'createdAt', 'updatedAt']
    })
    res.send(usuario)
})

router.put('/usuarios/:id', async function (req, res) {
    const usuario = await Usuario.findByPk(req.params.id)
    if (!usuario)
        return res.sendStatus(404)

    console.log(usuario)
    usuario.nomeUsuario = req.body.nomeUsuario
    usuario.senha = req.body.senha
    usuario.save()
        .then(function () {
            res.sendStatus(200)
        }).catch(function () {
            res.sendStatus(400)
        })
})

//Deleta o usuario e todos os rankings dele
router.delete('/usuarios/:id', async function (req, res) {
    await Ranking.destroy({
        where: { idUsuario: req.params.id }
    }).then(async function () {
        await Usuario.destroy({
            where: { id: req.params.id }
        }).then(function () {
            res.sendStatus(200)
        }).catch(function () {
            res.sendStatus(404)
        })
    }).catch(function () {
        res.sendStatus(404)
    })
})
module.exports = router