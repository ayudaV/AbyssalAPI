const Sequelize = require('sequelize')
const db = require('../db')

const Ranking = db.define('ranking', {
    idUsuario: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    pontuacao: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
})
module.exports = Ranking