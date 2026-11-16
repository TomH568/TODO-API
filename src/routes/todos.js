import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import { 
    createNewTodo,
    getTodos,
    getTodoById,
    updateTodo,
    deleteTodo
} from '../services/todos.js'

const router = express.Router()

// POST /todos
router.post('/', (req, res) => {
    if (!req.header("Content-Type")) {
        return res.status(417).json({error: "Specify Content-Type"})
    }
    if (req.header("Content-Type") != "application/json") {
        return res.status(415).json({error: "Only Content-Type: application/json accepted"})
    }
    if (!req.body.title) { // Title required
        return res.status(400).json({error: "No provided title"})
    }
    if (typeof req.body.title != "string") {
        return res.status(400).json({error: "Title should be a string."})
    }
    if (req.body.description) {
        if (typeof req.body.description != "string") {
            return res.status(400).json({error: "Description should be a string."})
        }
    }
    const newtodo = createNewTodo(req.body.title, req.body.description, req.body.state, req.body.dueDate)
    return res.status(201).json({Status: "Successfully created todo!", Content: newtodo})
})

// Not allowed method
router.post('/:id', (req, res) => {
    return res.status(405).json({error: "Allow: GET, PUT, DELETE"})
})

// GET /todos
router.get('/', (req, res) => {
    const todos = getTodos(req.query.state)
    return res.status(200).json( todos )
})

// GET /todos/{id}
router.get('/:id', (req, res) => {
    const todo = getTodoById(req.params.id)
    if ( !todo ) {
        return res.status(404).json({error: `Todo not found with id: ${req.params.id}`})
    } else {
        return res.status(200).json( todo )
    }
})

// Not allowed method
router.put('/', (req, res) => {
    return res.status(405).json({error: "Allow: POST, GET"})
})

// PUT /todos/{id}
router.put('/:id', (req, res) => {
    if (!req.header("Content-Type")) {
        return res.status(417).json({error: "Specify Content-Type"})
    }
    if (req.header("Content-Type") != "application/json") {
        return res.status(415).json({error: "Only Content-Type: application/json accepted"})
    }
    if (!req.body.title && !req.body.description && !req.body.state && !req.body.dueDate) {
        return res.status(400).json({error: "No provided title/desciption/state/dueDate to update"})
    }
    if (req.body.title) {
        if (typeof req.body.title != "string") {
            return res.status(400).json({error: "Title should be a string."})
        }
    }
    if (req.body.description) {
        if (typeof req.body.description != "string") {
            return res.status(400).json({error: "Description should be a string."})
        }
    }
    const updatedTodo = updateTodo(req.params.id, req.body.title, req.body.description, req.body.state, req.body.dueDate)
    if ( !updatedTodo ) {
        return res.status(404).json({error: `Todo not found with id: ${req.params.id}`})
    } else {
        return res.status(200).json({Status: "Successfully updated todo!", "Content": updatedTodo})
    }
})

// Not allowed method
router.delete('/', (req, res) => {
    return res.status(405).json({error: "Allow: POST, GET"})
})

// DELETE /todos/{id}
router.delete('/:id', (req, res) => {
    const todo = deleteTodo(req.params.id)
    if ( !todo ) {
        return res.status(404).json({error: `Todo not found with id: ${req.params.id}`})
    } else {
        return res.status(200).json({Status: `Successfully deleted todo with id: ${req.params.id}`})
    }
})

export default router