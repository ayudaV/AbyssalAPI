const express = require('express')
const bodyParser = require('body-parser')
const database = require('./db')
const rotasRanking = require('./routes/rotasRanking')
const rotasUsuario = require('./routes/rotasUsuario')
const rotasLoginSignup =  require('./routes/rotasLoginSignup')

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

    ; (async () => {
        await database.sync(/*{force:true}*/)
    })()

app.get('/usuarios', rotasUsuario)
app.get('/usuarios/:id', rotasUsuario)
app.get('/usuariosByName/:nome', rotasUsuario)
app.put('/usuarios/:id', rotasUsuario)
app.delete('/usuarios/:id', rotasUsuario)

app.get('/rankings', rotasRanking)
app.get('/orderRankings', rotasRanking)
app.get('/rankings/:id', rotasRanking)
app.get('/rankingsByUser/:id',rotasRanking)
app.get('/orderRankingsByUser/:id', rotasRanking)
app.get('/rankingsByFase/:fase',rotasRanking)
app.get('/orderRankingsByFase/:fase', rotasRanking)
app.get('/rankingsByUserFase/:id/:fase', rotasRanking)
app.get('/orderRankingsByUserFase/:id/:fase', rotasRanking)

app.post('/rankings', rotasRanking)
app.delete('/rankings', rotasRanking)
app.delete('/rankings/:id', rotasRanking)

app.post('/authenticate', rotasLoginSignup)
app.post('/cadastro', rotasLoginSignup)

app.listen(8081)

