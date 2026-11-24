import { v4 as uuidv4 } from 'uuid'

// simulate the database
let todos = [
    {
        id: "0", 
        title: 'Study REST APIs',
        description: 'Read a dissertation by Roy Fielding',
        state: 'todo',
        dueDate: null,
        createdAt: Date(),
        modifiedAt: Date()
    }
]

export function verifyState(state) {
    if (state !== "doing" && state !== "done") {
        state = "todo"
    }
    return state
}

export function createNewTodo(title, description=null, state, dueDate=null) {
    const newstate = verifyState(state)
    let newtodo = {
        id: uuidv4(),
        title: title,
        description: description,
        state: newstate,
        dueDate: dueDate,
        createdAt: Date(),
        modifiedAt: Date()
    }
    todos.push(newtodo)
    return newtodo
}

export function getTodos(query, format) {
    if (query) {
        let filteredtodos = new Array
        todos.forEach(item => {
            if (item.state === query) {
                filteredtodos.push(item)
            }
        })
        return filteredtodos
    } else {
        return todos
    }
}

export function getTodoById(searchedId) {
    const todo = todos.find( anItem => anItem.id === searchedId )
    return todo
}

export function updateTodo(id, title, description=null, state, dueDate=null) {
    const updatedTodo = getTodoById(id)
    if (!updatedTodo) {
        return false
    }
    if (title) {
        updatedTodo.title = title
    }
    if (description) {
        updatedTodo.description = description
    }
    if (state) {
        const newstate = verifyState(state)
        updatedTodo.state = newstate
    }
    if (dueDate) {
        updatedTodo.dueDate = dueDate
    }
    updatedTodo.modifiedAt = Date() // Always updated with successful update
    return updatedTodo
}

export function deleteTodo(IdToDelete) {
    const todo = getTodoById(IdToDelete)
    if (!todo) {
        return false
    } else {
        todos.splice(todo, 1)
        return true
    }
}

export function resetTodos() {
    todos = [
    {
        id: "0", 
        title: 'Study REST APIs',
        description: 'Read a dissertation by Roy Fielding',
        state: 'todo',
        dueDate: null,
        createdAt: Date(),
        modifiedAt: Date()
    }
    ]
}

export function toCsv( todos ) {
    return [
        [
            "id",
            "title",
            "state",
            "dueDate",
            "createdAt",
            "modifiedAt"
        ],
        ...todos.map( item => [
            item.id,
            "\"" + item.title + "\"",
            "\"" + item.description + "\"",
            item.state,
            item.dueDate,
            item.createdAt,
            item.modifiedAt
        ])
    ].map(e => e.join(",")).join("\n")
}