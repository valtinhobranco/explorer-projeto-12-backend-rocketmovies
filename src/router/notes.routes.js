//? header
const { Router } = require('express')
const NotesController = require('../controllers/NotesController')
const notesRouter = Router()


const notesController = new NotesController()

//? main

notesRouter.get("/", notesController.index) 
notesRouter.post("/:user_id", notesController.create) 
notesRouter.get("/:id", notesController.show) 
notesRouter.delete("/:id", notesController.delete) 
notesRouter.put("/:id", notesController.update) 


//? footer 


module.exports = notesRouter