const Sequelize = require('sequelize')
const db = require('../db')

const Usuario = db.define('usuarios', {
    nomeUsuario: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    senha: {
        type: Sequelize.STRING,
        allowNull: false
    }
})
module.exports = Usuario