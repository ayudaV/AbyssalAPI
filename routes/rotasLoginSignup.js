const express = require('express')
const router = express.Router()
const Usuario = require('../models/usuario')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

router.post('/authenticate', async function (req, res) {

    await Usuario.findOne({ where: { nomeUsuario: req.body.nomeUsuario } }).then(user => {
        if (user === null) {
            res.status(401).json({ message: "Invalid credentials!" })
        } else {
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
                } else { res.status(401).json({ message: "Invalid credentials!" }) }
            })
        }
    }).catch(error => {
        res.status(500).json({ message: "Something went wrong!" + error })
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