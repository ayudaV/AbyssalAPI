const express = require('express')
const router = express.Router()
const Usuario = require('../models/usuario')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

router.post('/autenticacao', async function (req, res) {

    await Usuario.findOne({ where: { nomeUsuario: req.body.nomeUsuario } }).then(user => {
        if (user === null) {
            res.status(401).json({ message: "Credenciais Invalidas!" })
        } else {
            bcrypt.compare(req.body.senha, user.senha, function (err, result) {
                if (result) {
                    jwt.sign({
                        nomeUsuario: user.nomeUsuario,
                        idUsuario: user.id
                    }, 'secret', function (err, token) {
                        res.status(200).json({
                            message: "Autenticacao realizada com sucesso!",
                            idUsuario: user.id,
                            nomeUsuario: user.nomeUsuario,
                            token: token
                        })
                    })
                } else { res.status(401).json({ message: "Credenciais Invalidas!" }) }
            })
        }
    }).catch(error => {
        res.status(500).json({ message: "Algo deu errado!" + error })
    })
})
router.post('/cadastro', async function (req, res) {

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
module.exports = router