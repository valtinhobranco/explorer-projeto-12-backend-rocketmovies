const knex = require('../database/knex')

const AppError = require('../utils/AppError')

const sqliteConnection = require("../database/sqlite")

class NotesController  {
    async create(request, response) {
        const { title, description, rating, tags } = request.body
        const { user_id } = request.params
        
        //? Verificação de nota 
        
        if (rating <= 0 || rating > 5) {
            throw new AppError('Nota para o filme tem que ser entre 1 a 5')
        }

        //? Verificação se a tag esta ok?

        const filterTags = tags.map(tag => tag.trim())
        console.log('filterTags: ', filterTags);
        // if (filterTags ) {
        //     throw new AppError('Nota para o filme tem que ser entre 1 a 5')
        // }

         //? criando uma conexao com o banco para analisar os dados
        const database = await sqliteConnection()
        
        //? verificar se titulo ja existe
        // const checkTitleExist = await database.get('SELECT * FROM movie_notes WHERE title = (?)', [title])
        const checkTitleExist = await knex("movie_notes")
        .where("title", title)
        .first()
                
          if (checkTitleExist) {
            throw new AppError('Este titulo ja existe')
          }
        
     
        
        //? adicionado os parametros nas notas
        
        const [note_id] = await knex("movie_notes").insert({
            title,
            description,
            rating,
            user_id
            
        })
        
        
        //? adicionado os parametros nas tags
        const tagsInset = tags.map(name => {

            return {
                note_id,
                user_id,
                name: name
            }
        }) 
        
        await knex('movie_tags').insert(tagsInset)
        
        return  response.status(201).json()
        
    }
    
    async update(request, response) {
        const { title, description, rating, tags } = request.body
        const { id } = request.params

        //? verificação de usuário
        const movie = await knex("movie_notes").where("id", id).first()

        if (!movie) {
            throw new AppError('Cadastro não encontrado')
        }

        if (rating <= 0 || rating > 5) {
            throw new AppError('Nota para o filme tem que ser entre 1 a 5')
        }

            
        
        movie.title = title ?? movie.title
        movie.description = description ?? movie.description
        movie.rating = rating ?? movie.rating
        // movie.tags = tags ?? movie.tags

      

        //? adicionado os parametros nas tags

        
       

        await  knex.transaction(trx => {
            const queries = collection.map(tuple =>
              knex(table)
                .where('id', tuple.id)
                .update(tuple)
                .transacting(trx)
            );
            return Promise.all(queries)
              .then(trx.commit)    
              .catch(trx.rollback);
          })

        await knex('movie_tags')
            .where('note_id', id)
            .update({
                name: 'test'
            })    

        await knex('movie_notes')
            .where('id', id)
            .update({
                title: movie.title,
                description: movie.description,
                rating: movie.rating,
                updated_at:knex.fn.now(),
            })


        return response.status(200).json()
    }

    
    async show(request, response) { 
        const { id } = request.params
        
        // buscar dados das notas
        const note = await knex("movie_notes").where({ id }).first()
        const tags = await knex("movie_tags").where({ note_id: id }).orderBy('name')
        
        
        return response.status(200).json({ ...note, tags } )
    }
    
    async delete(request, response) { 
        const { id } = request.params
        
        // deletando nota
        await knex("movie_notes").where({ id }).delete()
        
        
        
        return response.status(200).json()
    }
    
    async index(request, response) { 
        const { user_id, title, tags } = request.query
        
        let notes;
        
        if (tags) {
            const filterTags = tags.split(',').map(tag => tag.trim())
            
            notes = await knex("movie_tags")
            .select([
                "movie_notes.id" ,
                "movie_notes.title" ,
                "movie_notes.user_id" 
            ])
            .where("movie_notes.user_id", user_id)   
            .whereLike("movie_notes.title", `%${title}%`)    
            .whereIn("name", filterTags)
            .innerJoin("movie_notes", "movie_notes.id", "movie_tags.note_id")
            .orderBy('movie_notes.title')
        } else {
            
            // buscando dados com o whereLike para ter uma busca mais flexível
            notes = await knex("movie_notes")
            .where({ user_id })
            .whereLike("title", `%${title}%`)
            .orderBy("title")
        }
        
        // criando um filtro
        
        const userTags = await knex('movie_tags').where({ user_id })
        const notesWithTags = notes.map(note => {
            const noteTags = userTags.filter(tag => tag.note_id === note.id)
            
            return {
                ...note,
                tags: noteTags
            }
        } )
        
        
        
        
        return response.status(200).json(notesWithTags)
    }
    
    
}

module.exports = NotesController