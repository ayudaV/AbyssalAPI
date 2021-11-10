const Sequelize = require('sequelize')
const db = require('../db')
const Usuario = require('./usuario')

const Ranking = db.define('ranking', {
    pontuacao: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    fase: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
})
Ranking.belongsTo(Usuario, {
    constraint: true,
    allowNull: false,
    foreignKey: 'idUsuario'
})
module.exports = Ranking