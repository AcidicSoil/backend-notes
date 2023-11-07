const mongoose = require("mongoose");

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

const Note = mongoose.model("Note", noteSchema);

// The following block of code is for creating and saving a new note.
// Uncomment this block to use it.
/*
const note = new Note({
  content: "HTML is Easy",
  important: true,
});

note
  .save()
  .then(() => {
    console.log("Note saved!");
    mongoose.connection.close(); // Ensures that the connection is closed after the operation
  })
  .catch((error) => {
    console.error("Error saving note:", error);
    mongoose.connection.close(); // Close connection even on error
  });
*/

/*
// Fetching only important notes from the database
Note.find({ important: true }) // Filtering condition
  .then(result => {
    result.forEach(note => {
      console.log(note); // This will log only the notes where important is true
    });
    mongoose.connection.close(); // It's good practice to close the connection when done
  })
  .catch(error => {
    console.error("Error fetching notes:", error);
    mongoose.connection.close(); // Close connection even on error
  });
*/

// Fetching all notes from the database
Note.find({})
  .then((result) => {
    result.forEach((note) => {
      console.log(note);
    });
    mongoose.connection.close(); // Close connection after fetching notes
  })
  .catch((error) => {
    console.error("Error fetching notes:", error);
    mongoose.connection.close(); // Close connection even on error
  });
