//? header
const { Router } = require('express')
const TagsController = require('../controllers/TagsController')
const tagsRouter = Router()


const tagsController = new TagsController()

//? main

tagsRouter.get("/:user_id", tagsController.index) 

//? footer 


module.exports = tagsRouter