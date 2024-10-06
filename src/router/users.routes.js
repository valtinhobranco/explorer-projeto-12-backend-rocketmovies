//? header
const { Router } = require('express')
const UsersController = require('../controllers/UsersController')
const usersRouter = Router()


const usersController = new UsersController()

//? main

usersRouter.post("/", usersController.create) 
usersRouter.put("/:id", usersController.update) 

//? footer 


module.exports = usersRouter