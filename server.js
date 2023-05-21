// Global variable to store module requirements.
const express = require('express');
const fs = require('fs');
const path = require('path');

// Global variable to initialize and set up express server.
const app = express();
const PORT = process.env.PORT || 3001;

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

// API route for creating and saving new notes into the database for usage.
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
        		return res.status(500).json({ error: 'Failed to save the note database!' });
      		}
      		// Returns the new note as a response.
      		res.json(newNote);
    });
  });
});

// API route to deleting notes by ID.
app.delete('/api/notes/:id', (req, res) => {
  	// Read the notes from the db.json file.
  	fs.readFile('./db/db.json', 'utf8', (err, data) => {
    	// If statement to check for any potential errors.
    	if (err) {
      		console.error(err);
      		return res.status(500).json({ error: 'Failed to read the note database!' });
    	}

    	// Parse the data as JSON into a variable.
    	const notes = JSON.parse(data);

    	// Find the index of the note with the given ID.
    	const noteIndex = notes.findIndex(note => note.id === parseInt(req.params.id));

    	// If the note is found, remove from the array.
    	if (noteIndex !== -1) {
      		notes.splice(noteIndex, 1);

      		// Write the updated notes to the db.json file.
      		fs.writeFile('./db/db.json', JSON.stringify(notes, null, 2), (err) => {
       	 		// If statement to check for any potential errors.
        		if (err) {
          			console.error(err);
          			return res.status(500).json({ error: 'Failed to delete the note!' });
        	}
        	// Return a message on a successful response.
        	res.json({ message: 'Note deleted successfully!' });
      		});
    	// Else statement if there isn't any notes.
    	} else {
      	// If the note is not found, then return an error.
      	res.status(404).json({ error: 'Note not found!' });
    	}
  	});
});

// A Route to the Notes HTML file within public folder.
app.get('/notes', (req, res) => {
  	res.sendFile(path.join(__dirname, '/public/notes.html'));
});

// A Route to the Index HTML file within public folder.
app.get('*', (req, res) => {
  	res.sendFile(path.join(__dirname, '/public/index.html'));
});

// Starts the server.
app.listen(PORT, () => {
  	console.log(`Server is listening on PORT: ${PORT}`);
});