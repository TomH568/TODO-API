import { describe, test } from "node:test"
import assert from "node:assert/strict"
import request from "supertest"
import app from "../src/app.js"

describe('POST /todos', () => {
    test('Responds with 417 error: "Specify Content-Type"', async () => {
        const res = await request(app)
            .post('/todos')
            .expect(417)
        assert.deepEqual(res.body, { error: 'Specify Content-Type' })
    })

    test('Responds with 415 error: "Only Content-Type: application/json accepted"', async () => {
        const res = await request(app)
            .post('/todos')
            .set('Content-Type', 'application/js')
            .expect(415)
        assert.deepEqual(res.body, { error: 'Only Content-Type: application/json accepted' })
    })

    test('Responds with 400 error: "No provided title"', async () => {
        const res = await request(app)
            .post('/todos')
            .set('Content-Type', 'application/json')
            .expect(400)
        assert.deepEqual(res.body, { error: 'No provided title' })
    })

    test('Responds with 400 error: "Title should be a string."', async () => {
        const res = await request(app)
            .post('/todos')
            .set('Content-Type', 'application/json')
            .send('{"title": 1}')
            .expect(400)
        assert.deepEqual(res.body, { error: 'Title should be a string.' })

    })

    test('Responds with 400 error: "Description should be a string."', async () => {
        const res = await request(app)
            .post('/todos')
            .set('Content-Type', 'application/json')
            .send('{"title": "1", "description": 1}')
            .expect(400)
        assert.deepEqual(res.body, { error: 'Description should be a string.' })
    })

    test('Responds with 201, Status: Successfully created todo!, content: {created todo}', async () => {
        const res = await request(app)
            .post('/todos')
            .set('Content-Type', 'application/json')
            .send('{"title": "1", "state": "doing"}')
            .expect('Content-Type', /json/i)
            .expect(201)
        assert.deepStrictEqual(res.body.Status, 'Successfully created todo!')
        const todo = res.body.Content
        assert.deepStrictEqual(todo.title, "1")
        assert.deepStrictEqual(todo.description, null)
        assert.deepStrictEqual(todo.state, "doing")
        assert.deepStrictEqual(todo.dueDate, null)
    })
})

describe('POST /todos/{id}', () => {
    test('Responds with 405 error: "Allow: GET, PUT, DELETE"', async () => {
        const res = await request(app)
            .post('/todos/1')
            .set('Content-Type', 'application/json')
            .send('{"title": "1"}')
            .expect(405)
        assert.deepStrictEqual(res.body.error, 'Allow: GET, PUT, DELETE')
    })
})

describe('GET /todos', () => {
    test('Responds with 200 and an array of all todos', async () => {
        const res = await request(app)
            .get('/todos/')
            .expect('Content-Type', /json/i)
            .expect(200)
        const todos = res.body
        assert.ok(Array.isArray(todos))
        assert.deepStrictEqual(todos.length, 2)
        assert.deepStrictEqual(todos[0].id, "0")
    })

    test('Responds with 200 and an array of filtered todos with state "todo"', async () => {
        const res = await request(app)
            .get('/todos/?state=todo')
            .expect('Content-Type', /json/i)
            .expect(200)
        const todos = res.body
        assert.ok(Array.isArray(todos))
        assert.deepStrictEqual(todos.length, 1)
        assert.deepStrictEqual(todos[0].id, "0")
        assert.deepStrictEqual(todos[0].state, "todo")
        assert.ok(!todos.some(item => item.state !== "todo"))
    })

    test('Responds with 200 and an empty array when using non-existing state', async () => {
        const res = await request(app)
            .get('/todos/?state=planning')
            .expect('Content-Type', /json/i)
            .expect(200)
        const todos = res.body
        assert.ok(Array.isArray(todos))
        assert.deepStrictEqual(todos.length, 0)
    })
})

describe('GET /todos/{id}', () => {
    test('Responds with 200 and the todo item with id 0', async () => {
        const res = await request(app)
            .get('/todos/0')
            .expect('Content-Type', /json/i)
            .expect(200)
        const todo = res.body
        assert.ok(typeof todo, "object")
        assert.deepStrictEqual(todo.id, "0")
    })

    test('Responds with 404 error: "Todo not found with id: 999"', async () => {
        const res = await request(app)
            .get('/todos/999')
            .expect(404)
        assert.deepStrictEqual(res.body.error, 'Todo not found with id: 999')
    })
})

describe('PUT /todos/', () => {
    test('Responds with 405 error: "Allow: POST, GET"', async () => {
        const res = await request(app)
            .put('/todos/')
            .expect(405)
        assert.deepStrictEqual(res.body.error, 'Allow: POST, GET')
    })
})

describe('PUT /todos/{id}', () => {
    test('Responds with 200, updates the todo with given id, and Status: "Successfully updated todo!", "Content": updatedTodo', async () => {
        const res = await request(app)
            .put('/todos/0')
            .set('Content-Type', 'application/json')
            .send('{"state": "doing"}')
            .expect('Content-Type', /json/i)
            .expect(200)
        assert.deepStrictEqual(res.body.Status, 'Successfully updated todo!')
        const updatedTodo = res.body.Content
        assert.deepStrictEqual(updatedTodo.id, '0')
        assert.deepStrictEqual(updatedTodo.state, 'doing')
        
        const getAllTodos = await request(app)
            .get('/todos/')
            .expect(200)
        const todoInList = getAllTodos.body.find(item => item.id === "0")
        assert.deepStrictEqual(updatedTodo, todoInList)
    })

    test('Responds with 417 error: "Specify Content-Type"', async () => {
        const res = await request(app)
            .put('/todos/0')
            .expect('Content-Type', /json/i)
            .expect(417)
        assert.deepStrictEqual(res.body.error, 'Specify Content-Type')
    })

    test('Rresponds with 415 error: "Only Content-Type: application/json accepted"', async () => {
        const res = await request(app)
            .put('/todos/0')
            .set('Content-Type', 'application/js')
            .send('{"state": "doing"}')
            .expect('Content-Type', /json/i)
            .expect(415)
        assert.deepStrictEqual(res.body.error, 'Only Content-Type: application/json accepted')
    })

    test('Responds with 400 error: "No provided title/desciption/state/dueDate to update"', async () => {
        const res = await request(app)
            .put('/todos/0')
            .set('Content-Type', 'application/json')
            .send('{}')
            .expect('Content-Type', /json/i)
            .expect(400)
        assert.deepStrictEqual(res.body.error, 'No provided title/desciption/state/dueDate to update')
    })

    test('Responds with 400 error: "Title should be a string."', async () => {
        const res = await request(app)
            .put('/todos/0')
            .set('Content-Type', 'application/json')
            .send('{"title": 1}')
            .expect('Content-Type', /json/i)
            .expect(400)
        assert.deepStrictEqual(res.body.error, 'Title should be a string.')
    })

    test('Responds with 400 error: "Description should be a string."', async () => {
        const res = await request(app)
            .put('/todos/0')
            .set('Content-Type', 'application/json')
            .send('{"description": 1}')
            .expect('Content-Type', /json/i)
            .expect(400)
        assert.deepStrictEqual(res.body.error, 'Description should be a string.')
    })

    test('Responds with 404 error: "Todo not found with id: id"', async () => {
        const res = await request(app)
            .put('/todos/1')
            .set('Content-Type', 'application/json')
            .send('{"description": "1"}')
            .expect('Content-Type', /json/i)
            .expect(404)
        assert.deepStrictEqual(res.body.error, 'Todo not found with id: 1')
    })
})

describe('DELETE /todos/', () => {
    test('Responds with 405 error: "Allow: POST, GET"', async () => {
        const res = await request(app)
            .delete('/todos/')
            .expect(405)
        assert.deepStrictEqual(res.body.error, 'Allow: POST, GET')
    })
})

describe('DELETE /todos/{id}', () => {
    test('Responds with 200 Status: "Successfully deleted todo with id: id" and selected todo is deleted from todos', async () => {
        const res = await request(app)
            .delete('/todos/0')
            .expect(200)
        assert.deepStrictEqual(res.body.Status, 'Successfully deleted todo with id: 0')
        await request(app)
            .get('/todos/0')
            .expect(404)
        const getAllTodos = await request(app)
            .get('/todos/')
            .expect(200)
        assert.deepStrictEqual(getAllTodos.body.length, 1)
    })

    test('Responds with 404 error: "Todo not found with id: id"', async () => {
        const res = await request(app)
            .delete('/todos/1')
            .expect(404)
        assert.deepStrictEqual(res.body.error, 'Todo not found with id: 1')
    })
})