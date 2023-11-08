require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();

const mongoose = require("mongoose");

const Note = require("./models/note");

/*
const url = process.env.MONGODB_URI;
console.log(process.env.MONGODB_URI);
mongoose.connect(url);

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});

const Note = mongoose.model("Note", noteSchema);
*/
/*
if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

const password = process.argv[2];
const dbname = "noteApp"; // Replace with your database name

const url = `mongodb+srv://FEphonebookAdmin:${password}@cluster0.zm1apny.mongodb.net/${dbname}`;

mongoose
  .connect(url)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});

// const Note = mongoose.model("Note", noteSchema);
*/
app.use(express.static("dist"));
app.use(express.json());
app.use(cors());

let notes = [];

app.use((request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
});

app.get("/api/notes", (request, response) => {
  Note.find({})
    .then((notes) => {
      response.json(notes);
    })
    .catch((error) => next(error));
});

app.get("/api/notes/:id", (request, response) => {
  Note.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/notes/:id", (request, response) => {
  Note.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/notes", (request, response, next) => {
  const body = request.body;

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  note
    .save()
    .then((savedNote) => {
      response.json(savedNote);
    })
    .catch((error) => next(error));
});

app.use((error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
});

app.use((request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
