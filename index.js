const express = require('express')
const bodyParser = require('body-parser')
const database = require('./db')
const Usuario = require('./models/usuario')
const Ranking = require('./models/ranking')
const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

(async () => {
    await database.sync()
})()

app.get('/usuarios', async function (req, res) {
    const usuarios = await Usuario.findAll()
    res.send(usuarios)
})
app.get('/usuarios/:id', async function (req, res) {
    const usuario = await Usuario.findByPk(req.params.id)
    res.send(usuario)
})
app.get('/rankings', async function (req, res) {
    const rakings = await Ranking.findAll()
    res.send(rakings)
})
app.get('/ranking/:id', async function (req, res) {
    const ranking = await Ranking.findByPk(req.params.id)
    res.send(ranking)
})
app.get('/rankingByUser/:id', async function (req, res) {
    const rankings = await Ranking.findAll({
        where: {
            idUsuario: req.params.id
        }
    })
    res.send(rankings)
})

app.post('/usuario', async function (req, res) {
    await Usuario.create({
        nomeUsuario: req.body.nomeUsuario,
        senha: req.body.senha
    }).then(function () {
        res.sendStatus(201)
    }).catch(function () {
        res.sendStatus(406)
    })
})

app.post('/ranking', async function (req, res) {
    await Ranking.create({
        idUsuario: req.body.idUsuario,
        pontuacao: req.body.pontuacao
    }).then(function () {
        res.sendStatus(201)
    }).catch(function () {
        res.sendStatus(406)
    })
})
app.put('/usuario/:id', async function (req, res) {
    const usuario = await Usuario.findByPk(req.params.id)
    console.log(usuario)
    usuario.nomeUsuario = req.body.nomeUsuario
    usuario.senha = req.body.senha
    usuario.save()
        .then(function () {
            res.sendStatus(200)
        }).catch(function () {
            res.sendStatus(404)
        })
})
app.delete('/usuario/:id', async function (req, res) {
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
app.delete('/ranking/:id', async function (req, res) {
    await Ranking.destroy({
        where: { id: req.params.id }
    }).then(async function () {
        res.sendStatus(200)
    }).catch(function () {
        res.sendStatus(404)
    })
})
app.listen(8080)

