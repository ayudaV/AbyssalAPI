const express = require('express')
const router = express.Router()
const Usuario = require('../models/usuario')
const Ranking = require('../models/ranking')

router.get('/rankings', async function (req, res) {
    const rakings = await Ranking.findAll({
        attributes: ['id', 'pontuacao', 'fase', 'createdAt', 'updatedAt'],
        include: [{ model: Usuario, attributes: ['nomeUsuario'] }]
    })
    res.send(rakings)
})
router.get('/orderRankings', async function (req, res) {
    const rakings = await Ranking.findAll({
        order: [
            ['pontuacao', 'DESC'],
            ['fase', 'ASC']
        ],
        attributes: ['id', 'pontuacao', 'fase', 'createdAt', 'updatedAt'],
        include: [{ model: Usuario, attributes: ['nomeUsuario'] }]
    })
    res.send(rakings)
})
router.get('/rankings/:id', async function (req, res) {
    const ranking = await Ranking.findByPk(req.params.id, {
        attributes: ['id', 'pontuacao', 'fase', 'createdAt', 'updatedAt'],
        include: [{ model: Usuario, attributes: ['nomeUsuario'] }]
    })
    res.send(ranking)
})
router.get('/rankingsByUser/:id', async function (req, res) {
    const rankings = await Ranking.findAll({
        where: { idUsuario: req.params.id },
        attributes: ['id', 'pontuacao', 'fase', 'createdAt', 'updatedAt'],
        include: [{ model: Usuario, attributes: ['nomeUsuario'] }]
    })
    res.send(rankings)
})
router.get('/orderRankingsByUser/:id', async function (req, res) {
    const rakings = await Ranking.findAll({
        where: { idUsuario: req.params.id },
        order: [['fase', 'ASC'], ['pontuacao', 'DESC']],
        attributes: ['id', 'pontuacao', 'fase', 'createdAt', 'updatedAt'],
        include: [{ model: Usuario, attributes: ['nomeUsuario'] }]
    })
    res.send(rakings)
})
router.get('/rankingsByFase/:fase', async function (req, res) {
    const rankings = await Ranking.findAll({
        where: { fase: req.params.fase },
        attributes: ['id', 'pontuacao', 'fase', 'createdAt', 'updatedAt'],
        include: [{ model: Usuario, attributes: ['nomeUsuario'] }]
    })
    res.send(rankings)
})
router.get('/orderRankingsByFase/:fase', async function (req, res) {
    const rakings = await Ranking.findAll({
        where: { fase: req.params.fase },
        order: [['pontuacao', 'DESC']],
        attributes: ['id', 'pontuacao', 'fase', 'createdAt', 'updatedAt'],
        include: [{ model: Usuario, attributes: ['nomeUsuario'] }]
    })
    res.send(rakings)
})
router.get('/rankingsByUserFase/:id/:fase', async function (req, res) {
    const rankings = await Ranking.findAll({
        where: { idUsuario: req.params.id, fase: req.params.fase },
        attributes: ['id', 'pontuacao', 'fase', 'createdAt', 'updatedAt'],
        include: [{ model: Usuario, attributes: ['nomeUsuario'] }]
    })
    res.send(rankings)
})
router.get('/orderRankingsByUserFase/:id/:fase', async function (req, res) {
    const rakings = await Ranking.findAll({
        include: Usuario,
        where: { idUsuario: req.params.id, fase: req.params.fase },
        order: [['pontuacao', 'DESC']],
        attributes: ['id', 'pontuacao', 'fase', 'createdAt', 'updatedAt'],
        include: [{ model: Usuario, attributes: ['nomeUsuario'] }]
    })
    res.send(rakings)
})

router.post('/rankings', async function (req, res) {
    const rakings = await Ranking.findAll({
        where: { idUsuario: req.body.idUsuario, fase: req.body.fase, pontuacao: req.body.pontuacao },
    }).then(raking => {
        if (raking === null) 
            res.status(401).json({ message: "Ranking Duplicado!" })
    })
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

router.delete('/rankings', async function (req, res) {
    await Ranking.destroy()
        .then(async function () {
            res.sendStatus(200)
        }).catch(function () {
            res.sendStatus(404)
        })
})
router.delete('/rankings/:id', async function (req, res) {
    await Ranking.destroy({
        where: { id: req.params.id }
    }).then(async function () {
        res.sendStatus(200)
    }).catch(function () {
        res.sendStatus(404)
    })
})

module.exports = router