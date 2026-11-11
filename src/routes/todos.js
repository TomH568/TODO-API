import express, { response } from 'express'
import { v4 as uuidv4 } from 'uuid'

const router = express.Router()

// simulate the database
let todos = [
    {
        id: "0", 
        title: 'Study REST APIs',
        description: 'Read a dissertation by Roy Fielding',
        state: 'todo',
        createdAt: Date.now(),
        modifiedAt: Date.now()
    }
]

// POST /todos
router.post('/', (req, res) => {
    if (!req.header("Content-Type")) {
        return res.status(400).json({error: "Specify Content-Type"})
    }
    if (!req.body.title || !req.body.description || !req.body.state) {
        return res.status(401).json({error: "No title/desciption/state"})
    }
    let newstate;
    if (req.body.state != "todo" && req.body.state != "doing" && req.body.state != "done") {
            newstate = "todo" // Default
    } else {
        newstate = req.body.state
    }
    todos.push({
        id: uuidv4(),
        title: req.body.title,
        description: req.body.description,
        state: newstate,
        createdAt: Date.now(),
        modifiedAt: Date.now()
    })
    return res.json({"Status": "successfully created todo!"})
})

// GET /todos
router.get('/', (req, res) => {
    res.json( todos )
})

// GET /todos/{id}
router.get('/:id', (req, res) => {
    const id = req.params.id
    const todo = todos.find( anItem => anItem.id === id )
    if ( !todo ) {
        return res.status(404).json({error: "Todo not found"})
    } else {
        return res.json( todo )
    }
})

// PUT /todos/{id}
router.put('/:id', (req, res) => {
    if (!req.header("Content-Type")) {
        return res.status(400).json({error: "Specify Content-Type"})
    }
    if (!req.body.title && !req.body.description && !req.body.state) {
        return res.status(401).json({error: "No title/desciption/state"})
    }
    const id = req.params.id
    const todo = todos.find( anItem => anItem.id === id )
    if ( !todo ) {
        return res.status(404).json({error: "Todo not found"})
    }
    if (req.body.title) {
        todo.title = req.body.title
    }
    if (req.body.description) {
        todo.description = req.body.description
    }
    if (req.body.state) {
        if (req.body.state != "todo" && req.body.state != "doing" && req.body.state != "done") {
            todo.state = "todo" // Default
        } else {
            todo.state = req.body.state
        }
    }
    todo.modifiedAt = Date.now()
    return res.json({"Status": "successfully updated todo!", "Content": todo})
})

// DELETE /todos/{id}
router.delete('/:id', (req, res) => {
    const id = req.params.id
    const todo = todos.find( anItem => anItem.id === id )
    if ( !todo ) {
        return res.status(404).json({error: "Todo not found"})
    }
    todos.splice(todo, 1)
    return res.json({"Status": "successfully deleted todo!", "id": req.params.id})
})

export default router