const express = require("express");
const cors = require("cors"); // <-- Import the CORS module
const app = express();

// Middleware to serve static content
app.use(express.static("dist"));

// Middleware to parse JSON bodies
app.use(express.json());

// Using CORS middleware
app.use(cors()); // <-- Use CORS middleware to allow cross-origin requests

// Custom middleware for logging request details
const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

// Registering the request logger middleware
app.use(requestLogger);

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

// Route to fetch all notes
app.get("/api/notes", (request, response) => {
  response.json(notes);
});

// Route to fetch a single note by ID
app.get("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  const note = notes.find((note) => note.id === id);

  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});

// Route to delete a note
app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id !== id);

  response.status(204).end();
});

// Route to create a new note
app.post("/api/notes", (request, response) => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  const note = request.body;

  // Validation and creation logic here
  // ...

  notes = notes.concat(note);
  response.json(note);
});

// Middleware for unknown endpoints
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

// Registering the middleware for unknown endpoints
app.use(unknownEndpoint);

// Starting the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
