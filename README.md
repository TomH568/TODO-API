<h1>Overview</h1>
This is a repository created for assignments for the course API Programming IC10025-3003 Autumn 2026 with the goal of learning to make, test, and document a REST API.<br><br>

At its current state, the API allows to create/read/update/delete TODO-tasks using a simulated database while running on localhost:3000. Tasks are objects stored in JavaScript array and have unique IDs.
<h2>API Endpoints</h2>

- POST /todos
- GET /todos 
    - Supports query filter ?state=todo|doing|done
- GET /todos/{id}
- PUT /todos/{id}
- DELETE /todos/{id}

For testing the endpoints, see file `test.rest`.<br>
For automated unit tests and integration tests, run `npm run test`

<h2>TODO-object</h2>

{<br>
    &emsp;id: (string, created with uuidv4),<br>
    &emsp;title: (string, required),<br>
    &emsp;description: (string, optional;default null),<br>
    &emsp;state: (todo|doing|done, required;default todo),<br>
    &emsp;dueDate: (optional;default null),<br>
    &emsp;createdAt: (time when object was created),<br>
    &emsp;modifiedAt: (time when object was last modified)<br>
}

<h2>Notes</h2>
<h3>Assignment 4</h3>
Learned how to read request header to make sure we only accept json. Learned to use different status codes and write descriptive status/error messages. Decided to accept anything for state, but make it "todo" unless specified as "doing" or "done". Learned to test all the implemented paths using Visual Studio's REST Client extension. For the optional properties of Todo objects, I decided to use `null` as a default placeholder. <br><br>
I decided to not use AI for this project, because I'm only learning the basics and AI would most likely just add something unnecessary. <br><br>
As self reflection, for the next project I would refractor the code to multiple files rather than have one huge file like `todos.js` here. Also some repeated code could've been made into separate functions. 
<h3>Assignment 5</h3>
Refractored code with business logic in the services folder. Added unit tests found in tests/unit.test.js and integration tests found in tests/api.test.js. 