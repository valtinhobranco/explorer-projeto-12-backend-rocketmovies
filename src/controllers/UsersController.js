const knex = require('../database/knex')
const {hash, compare} = require('bcryptjs')
const AppError = require('../utils/AppError')

const sqliteConnection = require("../database/sqlite")

class UsersController {
  
  /*  
  index - GET para listar vários registros.
  show - GET para exibir um registro especifico.
  create - POST para criar um registro.
  update - PUT para atualizar um registro.
  delete - DELETE para remover um registro. 
  */
  
  async  create(request, response) {
    //* recuperar os dados da requisição
    const {name, email, password} = request.body
    
    //? verificar se email ja existe
    // const checkUserExist = await database.get('SELECT * FROM users WHERE email = (?)', [email])
    const checkUserExist = await knex("users")
      .where("email", email)
      .first()
    
    if (checkUserExist) {
      throw new AppError('Este email ja existe')
    }
    
    const hashedPassword = await hash(password, 8)
    
    //? Adicionado os dados no banco de dados
    
    // await database.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", 
    // [name, email, hashedPassword]
    // )
    await knex('users').insert({
      name,
      email,
      password: hashedPassword
    })
    
    
    return  response.status(201).json()
    
    
  }
  
  async update(request, response) {
    //* recuperar os dados da requisição
    const { name, email, password, old_password } = request.body
    //* recuperar id da requisiçao
    const { id } = request.params
    
    
    
  
    
    
    //? verificação de usuário
    // const user = await database.get('SELECT * FROM users WHERE id = (?)', [id])
    const user = await knex("users").where("id", id).first()

    
    
    if (!user) {
      throw new AppError('Usuário não encontrado')
    }
    
    //? verificar se email ja existe 
    
    // const userWithUpdatedEmail = await database.get('SELECT * FROM users WHERE email = (?)', [email])
    const userWithUpdatedEmail = await knex("users")
      .where("email", email)
      .whereNot("id", user.id)
      .first()
    
    // if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id ) {
    //   throw new AppError('Este email ja esta em uso')
    // }
    if (userWithUpdatedEmail ) {
      throw new AppError('Este email ja esta em uso')
    }
    
    
    
    //? caso passe nos filtros ele atualizara os dados
    
    user.name = name ?? user.name
    user.email = email ?? user.email
    
    if( password && !old_password) {
      throw new AppError('Você precisa informar a senha antiga para definir uma nova senha')
    }
    if( password && old_password) {
      const checkOldPassword = await compare(old_password, user.password)
      
      if (!checkOldPassword) {
        throw new AppError('A senha antiga não confere')
      }

      user.password = await  hash(password, 8)

     
    }
    
    // await database.run(`
    // UPDATE users SET
    // name = ?,
    // email = ?,
    // password = ?,
    // updated_at = DATETIME('now')
    // WHERE id = ?`,
    // [user.name, user.email, user.password, id]
    // )
  

    await knex('users')
    .where('id', id)
      .update({
      name:user.name,
      email:user.email,
      password:user.password,
      updated_at:knex.fn.now(),
    })
    
    return response.status(200).json()
  }
  
}

module.exports = UsersController