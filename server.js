// Global variable to store module requirements.
const express = require('express');
const fs = require('fs');
const path = require('path');

// Global variable to initialize and set up express server.
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware functions to set up express applications.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Routes for the API usage.
app.get('/api/notes', (req, res) => {
  // Reads content from the db.json file.
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    // If statement for potential errors.
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read the note database!' });
    }
    
    // Parse the array data then send it as a response to the client.
    const notes = JSON.parse(data);
    res.json(notes);
  }); 
});

// API route for creating and saving a new note onto the right navigation side.
app.post('/api/notes', (req, res) => {
  // Reads the notes from the db.json file.
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    // If statement to check for potential errors.
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read the note database!' });
    }

    // Parse the data as JSON into a variable.
    const notes = JSON.parse(data);

    // Generates a unique ID for the newly saved note.
    const newNote = req.body;
    newNote.id = Date.now();

    // Add the new note into the array.
    notes.push(newNote);

    // Write the updated notes to the db.json file for storage.
    fs.writeFile('./db/db.json', JSON.stringify(notes, null, 2), (err) => {
      // If statement to check for any potential errors.
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to save the note to the database!' });
      }

      // Returns the new note as a response.
      res.json(newNote);
    });
  });
});