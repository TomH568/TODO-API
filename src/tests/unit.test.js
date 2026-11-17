import { describe, test } from "node:test"
import assert from "node:assert/strict"

import { 
    verifyState,
    createNewTodo,
    getTodos,
    getTodoById,
    updateTodo,
    deleteTodo,
    resetTodos
} from '../services/todos.js'

describe('Todos Services Test', () => {
    test('verifyState should return "doing"|"done" when using them as inputs, otherwise "todo"', () => {
        const state = verifyState("doing")
        assert.strictEqual(state, "doing")
        const otherstate = verifyState()
        assert.strictEqual(otherstate, "todo")
    })
    console.log(getTodos())
    test('createNewTodo should return the new todo item', () => {
        const newTodo = createNewTodo("any", undefined, "done", undefined)
        assert.strictEqual(newTodo.title, "any")
        assert.strictEqual(newTodo.state, "done")
        assert.strictEqual(newTodo.description, null)
        assert.strictEqual(newTodo.dueDate, null)
    })

    test('getTodos should return array of todos', () => {
        const todos = getTodos()
        assert.ok(Array.isArray(todos))
        assert.strictEqual(todos.length, 2)
    })

    test('getTodo with query should only return todos with matching state', () => {
        const todos = getTodos("todo")
        assert.strictEqual(todos.length, 1)
        assert.ok(!todos.some(item => item.state !== "todo"))
    })

    test('getTodoById should return todo object with matching id or undefined when not found', () => {
        const todo = getTodoById("0")
        assert.ok(typeof todo, "object")
        assert.strictEqual(todo.id, "0")
        assert.strictEqual(todo.title, 'Study REST APIs')
    })

    test('updateTodo should update the todo with given id in todos and return updated todo, or if todo not found, return false', () => {
        const updatedTodo = updateTodo("0", "New title", "Was done long ago", "done", "Thu Jan 01 1970 02:00:00 GMT+0200 (Eastern European Standard Time)")
        const todoInTodos = getTodoById("0")
        assert.strictEqual(updatedTodo, todoInTodos)
        assert.ok(typeof updatedTodo, "object")
        assert.strictEqual(updatedTodo.title, "New title")
        assert.strictEqual(updatedTodo.description, "Was done long ago")
        assert.strictEqual(updatedTodo.state, "done")
        assert.strictEqual(updatedTodo.dueDate, "Thu Jan 01 1970 02:00:00 GMT+0200 (Eastern European Standard Time)")
        const anotherUpdatedTodo = updateTodo("1", "New title", "Was done long ago", "done", "Thu Jan 01 1970 02:00:00 GMT+0200 (Eastern European Standard Time)")
        assert.ok(!anotherUpdatedTodo)
        assert.strictEqual(anotherUpdatedTodo, false)
    })

    test('deleteTodo should delete the todo item with the provided id and return true', () => {
        const isDeleted = deleteTodo("0")
        assert.ok(isDeleted)
        assert.strictEqual(isDeleted, true)
        const todos = getTodos()
        assert.strictEqual(todos.length, 1)
        assert.ok(!getTodoById("0"))
    })

    test('resetTodos should reset todos to original state', () => {
        resetTodos()
        const todos = getTodos()
        assert.ok(Array.isArray(todos))
        assert.strictEqual(todos.length, 1)
        assert.ok(getTodoById("0"))
    })
})