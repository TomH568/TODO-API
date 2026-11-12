<h3>API Endpoints</h3>

- POST /todos
- GET /todos 
    - Supports query filter ?state=todo|doing|done
- GET /todos/{id}
- PUT /todos/{id}
- DELETE /todos/{id}

For testing the endpoints, see file `test.rest`.

<h3>TODO-object</h3>

{<br>
    &emsp;id: (created with uuidv4),<br>
    &emsp;title: (string, required),<br>
    &emsp;description: (string, optional;default null),<br>
    &emsp;state: (todo|doing|done, required;default todo),<br>
    &emsp;dueDate: (optional;default null),<br>
    &emsp;createdAt: (time when object was created),<br>
    &emsp;modifiedAt: (time when object was last modified)<br>
}

<h3>Notes</h3>

Learned how to read request header to make sure we only accept json. Learned to use different status codes and write descriptive status/error messages. Decided to accept anything for state, but make it "todo" unless specified as "doing" or "done". Learned to test all the implemented paths using Visual Studio's REST Client extension. For the optional properties of Todo objects, I decided to use `null` as a default placeholder. <br><br>
I decided to not use AI for this project, because I'm only learning the basics and AI would most likely just add something unnecessary. <br><br>
As self reflection, for the next project I would refractor the code to multiple files rather than have one huge file like `todos.js` here. Also some repeated code could've been made into separate functions. 