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
      return res.status(500).json({ error: 'Failed to read the database!' });
    }
    
    // Parse the array data then send it as a response to the client.
    const notes = JSON.parse(data);
    res.json(notes);
  }); 
});

