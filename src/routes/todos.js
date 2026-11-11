import express from 'express'
import { v4 as uuidv4 } from 'uuid'

const router = express.Router()

// simulate the database
let todos = [
    {
        id: uuidv4(), 
        title: 'Study REST APIs',
        description: 'Read a dissertation by Roy Fielding',
        state: 'todo',
        createdAt: Date.now(),
        modifiedAt: Date.now()
    }
]

router.get('/', (req, res) => {
    res.json( todos )
})

router.get('/:id', (req, res) => {
    const id = req.params.id
    const todo = todos.find( anItem => anItem.id === id )
    if ( !todo ) {
        return res.status(404).json({error: "Todo not found"})
    } else {
        return res.json( todo )
    }
})

export default router