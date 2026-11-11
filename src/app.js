import express from 'express'

import todosRouter from './routes/todos.js'

const app = express()

// support for json
app.use(express.json())

// define handlers for various routes
app.use('/todos', todosRouter)

// export the app object to server.js where we referred to that
export default app