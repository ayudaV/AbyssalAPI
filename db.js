const Sequelize = require('sequelize')
const sequelize = new Sequelize('abyssal_bd', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
})
module.exports = sequelize
