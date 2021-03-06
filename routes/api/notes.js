const express = require('express');
const fs = require('fs');
const path = require('path');
// const { fstat } = require('fs');
const router = express.Router();
let { notes: notesArray } = require('../../db/db.json'); 
let { idLastUsed } = require('../../db/db.json');

//----since moving route here and defining route in server
//----dont need '/api/notes' just '/' instead the former
//----is defined in the server.js
//----------------------------------------------GET ROUTES
router.get('/',(req, res) => {
    res.json(notesArray);
});

router.get('/:id', (req, res) => {
    // res.send(req.params.id);
    const found = notesArray.some(note => note.id === parseInt(req.params.id));
    if (found) {
        res.json(notesArray.filter(note => note.id === parseInt(req.params.id)));
    } else {
        //bad request
        res.status(400).json({msg: `No member with the id of ${req.params.id}`});
    }
});

//-----------------------------------------CREATION ROUTES
router.post('/', (req, res) => {
    // res.send(req.body);
    // console.log(notes);
    // console.log(idLastUsed);
    const newNote = {
        title: req.body.title,
        text: req.body.text,
        id: idLastUsed+1,
    };

    if (!newNote.title || !newNote.title) {
        return res.status(400).json({ msg: `Please include BOTH a title and text!`});
    }

    notesArray.push(newNote);
    console.log(`idLastUsed = ${idLastUsed} || and newNote.id = ${newNote.id}`);
    idLastUsed = newNote.id;

    fs.writeFileSync(
        path.join(__dirname, '../../db/db.json'),
        JSON.stringify({ notes: notesArray, idLastUsed: newNote.id}, null, 2)
    );

    res.json(notesArray);
});

//------------------------------------------UPDATE ROUTES
router.put('/:id', (req, res) => {
    const found = notesArray.some(note => note.id === parseInt(req.params.id));

    if (found) {
        const updatedNote = req.body;
        notesArray.forEach(note => {
            if (note.id === parseInt(req.params.id)) {
                note.title = updatedNote.title ? updatedNote.title : note.title;
                note.text = updatedNote.text ? updatedNote.text : note.text;

                res.json({ msg: `Member updated.`, note});
            }
        });
    } else {
        //bad request
        res.status(400).json({msg: `No member with the id of ${req.params.id}`});
    }
});

//------------------------------------------DELETE ROUTES
router.delete('/:id', (req, res) => {
    const found = notesArray.some(note => note.id === parseInt(req.params.id));

    if (found) {

        let newNotesList = notesArray.filter(note => note.id !== parseInt(req.params.id));
        // console.log(newNotesList);

        fs.writeFileSync(
            path.join(__dirname, '../../db/db.json'),
            JSON.stringify({notes: newNotesList, idLastUsed: idLastUsed}, null, 2)
        );
        notesArray = newNotesList;
        // console.table(newNotesList);

        res.status(200).json(notesArray);

    } else {
        //bad request
        res.status(400).json({msg: `No member with the id of ${req.params.id}`});
    }
});


module.exports = router;