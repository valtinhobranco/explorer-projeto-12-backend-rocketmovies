//? header 

require("express-async-errors")

//* database
const database = require('./database/sqlite')

//* utils
const AppError = require('./utils/AppError')

//* express
const express = require("express")

//* importando as rotas
const routes = require("./router")

const app = express()
//* transformando os dados em json para reconhecimento da api
app.use(express.json())



//? main 

app.use(routes)
database()
//? footer

//* configuração para interpretar erro na aplicação
app.use((error, request, response, next) => {
    if (error instanceof AppError) {
        return response.status(error.statusCode).json({
            status: "error",
            message: error.message
        })
    }
   
    console.error(error);


    return response.status(500).json({
        status: "error",
        message: 'Internal server error'
    })
})


const PORT = 3333;

app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`))