const config = require('../../../knexfile')
const knex = require('knex')

const connection = knex(config.development)


module.exports = connection

//? para criar uma nova tabela utilizar o npx knex migrate:make nomeDaTabela exep: createUsers