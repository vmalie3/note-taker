// variables that pulls in resources

const express = require('express');
const path = require('path');
const port =  process.env.PORT || 3001;
const fs = require('fs');

const app = express();

// app.use to allow it to function correctly

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// get request will send user to the index.html page in the public folder; /notes will send them to notes.html

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));

// get request will show existing notes in the db.json file

app.get('/api/notes', (req, res) => {
    let notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8', 2));

    return res.json(notes);
})

// post request allows users to input notes which will be added to the db.json file with an ID

app.post('/api/notes', (req, res) => {
    let data = path.join(__dirname, '/db/db.json');
    let newNote = req.body;

    console.log(newNote);

    let id = 1;
    let arr = require('./db/db.json')

    // finds the highest id number that exists
    for (let i = 0; i < arr.length; i++) {
        let thisNote = arr[i];
        if (thisNote.id > id) {
            id = thisNote.id;
        }
    }

    // makes the new note's ID one higher than the highest ID so they're unique
    newNote.id = id + 1;
    // pushes new notes into the array
    arr.push(newNote);

    //writes the array into the db.json file
    fs.writeFile(data, JSON.stringify(arr), (err) => {
        if (err) {
            return console.log(err);
        }
    })

    return res.json(arr);
})

// delete request deletes individual notes

app.delete('/api/notes/:id', (req, res) => {
    let id = req.params.id.toString();

    let data = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));

    const updatedData = data.filter( note => note.id.toString() != id);

    fs.writeFileSync('./db/db.json', JSON.stringify(updatedData));

    return res.json(updatedData);
})

app.listen(port);