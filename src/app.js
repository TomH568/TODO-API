import express from 'express'
import todosRouter from './routes/todos.js'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'

const app = express()

// support for json
app.use(express.json())

const swaggerDocument = YAML.load('./doc/api.yaml');

// define handlers for various routes
app.use('/todos', todosRouter)
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// export the app object to server.js where we referred to that
export default app