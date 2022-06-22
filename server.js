const express = require('express');
const path = require('path');
const port =  process.env.PORT || 3001;
const fs = require('fs');

const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));

app.get('/api/notes', (req, res) => {
    let notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8', 2));

    return res.json(notes);
})

app.post('/api/notes', (req, res) => {
    let data = path.join(__dirname, '/db/db.json');
    let newNote = req.body;

    console.log(newNote);

    let id = 1;
    let arr = require('./db/db.json')

    for (let i = 0; i < arr.length; i++) {
        let thisNote = arr[i];
        if (thisNote.id > id) {
            id = thisNote.id;
        }
    }

    newNote.id = id + 1;
    arr.push(newNote);

    fs.writeFile(data, JSON.stringify(arr), (err) => {
        if (err) {
            return console.log(err);
        }
    })

    return res.json(newNote);
})


app.delete('/api/notes/:id', (req, res) => {
    let id = req.params.id.toString();

    let data = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));

    const updatedData = data.filter( note => note.id.toString() != id);

    fs.writeFileSync('./db/db.json', JSON.stringify(updatedData));

    return res.json(updatedData);
})


app.listen(port);