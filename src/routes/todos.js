import express from 'express'
import { v4 as uuidv4 } from 'uuid'

const router = express.Router()

// simulate the database
let todos = [
    {
        id: "0", 
        title: 'Study REST APIs',
        description: 'Read a dissertation by Roy Fielding',
        state: 'todo',
        dueDate: null,
        createdAt: Date.now(),
        modifiedAt: Date.now()
    }
]

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
    let newdescription = null; // Default (optional)
    if (req.body.description) {
        newdescription = req.body.description
    }
    let newstate = "todo"; // Default (required)
    if (req.body.state == "doing" || req.body.state == "done") {
            newstate = req.body.state
    }
    let newdueDate = null; // Default (optional)
    if (req.body.dueDate) {
        newdueDate = req.body.dueDate
    }
    let newtodo = {
        id: uuidv4(),
        title: req.body.title,
        description: newdescription,
        state: newstate,
        dueDate: newdueDate,
        createdAt: Date.now(),
        modifiedAt: Date.now()
    }
    todos.push(newtodo)
    return res.status(201).json({Status: "Successfully created todo!", Content: newtodo})
})

// GET /todos
router.get('/', (req, res) => {
    if (req.query.state) {
        let filteredtodos = new Array
        todos.forEach(item => {
            if (item.state == req.query.state) {
                filteredtodos.push(item)
            }
        })
        if ( filteredtodos.length == 0 ) {
            return res.status(204)
        }
        return res.status(200).json( filteredtodos )
    }
    return res.status(200).json( todos )
})

// GET /todos/{id}
router.get('/:id', (req, res) => {
    const id = req.params.id
    const todo = todos.find( anItem => anItem.id === id )
    if ( !todo ) {
        return res.status(404).json({error: `Todo not found with id: ${id}`})
    } else {
        return res.status(200).json( todo )
    }
})

// PUT /todos/{id}
router.put('/:id', (req, res) => {
    if (!req.header("Content-Type")) {
        return res.status(400).json({error: "Specify Content-Type"})
    }
    if (!req.body.title && !req.body.description && !req.body.state) {
        return res.status(401).json({error: "No provided title/desciption/state to update"})
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
    return res.status(200).json({Status: "Successfully updated todo!", "Content": todo})
})

// DELETE /todos/{id}
router.delete('/:id', (req, res) => {
    const id = req.params.id
    const todo = todos.find( anItem => anItem.id === id )
    if ( !todo ) {
        return res.status(404).json({error: `Todo not found with id: ${id}`})
    }
    todos.splice(todo, 1)
    return res.status(200).json({Status: `Successfully deleted todo with id: ${id}`})
})

export default router