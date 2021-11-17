const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const database = require('./db')
const Usuario = require('./models/usuario')
const Ranking = require('./models/ranking')
const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

    ; (async () => {
        await database.sync(/*{force:true}*/)
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
app.get('/rankingByFase/:fase', async function (req, res) {
    const rankings = await Ranking.findAll({
        where: {
            fase: req.params.fase
        }
    })
    res.send(rankings)
})
app.post('/authenticate', async function (req, res) {

    await Usuario.findOne({ where: { nomeUsuario: req.body.nomeUsuario } }).then(user => {
        if (user === null) {
            res.status(401).json({
                message: "Invalid credentials!"
            })
        }
        else {
            bcrypt.compare(req.body.senha, user.senha, function (err, result) {
                if (result) {
                    const token = jwt.sign({
                        nomeUsuario: user.nomeUsuario,
                        idUsuario: user.id
                    }, 'secret', function (err, token) {
                        res.status(200).json({
                            message: "Authentication Successful!",
                            token: token
                        })
                    })
                }
                else {
                    res.status(401).json({
                        message: "Invalid credentials!"
                    })
                }
            })
        }
    }).catch(error => {
        res.status(500).json({
            message: "Something went wrong!" + error
        })
    })
})
app.post('/usuario', async function (req, res) {

    //Criptografa a Senha do usuario
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(req.body.senha, salt, async function (err, hash) {
            await Usuario.create({
                nomeUsuario: req.body.nomeUsuario,
                senha: hash
            }).then(function () {
                res.sendStatus(201)
            }).catch(function () {
                res.sendStatus(406)
            })
        })
    })
})

app.post('/ranking', async function (req, res) {
    await Ranking.create({
        idUsuario: req.body.idUsuario,
        pontuacao: req.body.pontuacao,
        fase: req.body.fase
    }).then(function () {
        res.sendStatus(201)
    }).catch(function () {
        res.sendStatus(406)
    })
})
app.put('/usuario/:id', async function (req, res) {
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
app.delete('/ranking', async function (req, res) {
    await Ranking.destroy()
        .then(async function () {
            res.sendStatus(200)
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

