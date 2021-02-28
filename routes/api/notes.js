const express = require('express');
const fs = require('fs');
const path = require('path');
// const { fstat } = require('fs');
const router = express.Router();
const { notes } = require('../../db/db.json'); 
let { idLastUsed } = require('../../db/db.json');

//----since moving route here and defining route in server
//----dont need '/api/notes' just '/' instead the former
//----is defined in the server.js
//----------------------------------------------GET ROUTES
router.get('/',(req, res) => {
    res.json(notes);
});

router.get('/:id', (req, res) => {
    // res.send(req.params.id);
    const found = notes.some(note => note.id === parseInt(req.params.id));
    if (found) {
        res.json(notes.filter(note => note.id === parseInt(req.params.id)));
    } else {
        //bad request
        res.status(400).json({msg: `No member with the id of ${req.params.id}`});
    }
});

//-----------------------------------------CREATION ROUTES
router.post('/', (req, res) => {
    // res.send(req.body);
    // console.log(notes);
    const newNote = {
        title: req.body.title,
        text: req.body.text,
        id: idLastUsed+1,
    };

    if (!newNote.title || !newNote.title) {
        return res.status(400).json({ msg: `Please include BOTH a title and text!`});
    }

    notes.push(newNote);
    console.log(`idLastUsed = ${idLastUsed} || and newNote.id = ${newNote.id}`);
    idLastUsed = newNote.id;

    fs.writeFileSync(
        path.join(__dirname, '../../db/db.json'),
        JSON.stringify({ notes: notes, idLastUsed: newNote.id}, null, 2)
    );

    res.json(notes);
});

//------------------------------------------UPDATE ROUTES
router.put('/:id', (req, res) => {
    const found = notes.some(note => note.id === parseInt(req.params.id));

    if (found) {
        const updatedNote = req.body;
        notes.forEach(note => {
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
    const found = notes.some(note => note.id === parseInt(req.params.id));
    console.log('smack the route',found);
    if (found) {
        res.json
        fs.writeFileSync(
            path.join(__dirname, '../../db/db.json'),
            JSON.stringify({ notes: notes.filter(note => note.id !== parseInt(req.params.id)), idLastUsed: idLastUsed}, null, 2)
        );
        console.table(notes);
        // res.json(notes);
        res.status(200).json({msg: `Note deleted!`});
        // res.json({ 
        //     msg: 'Note deleted', 
        //     notes: notes.filter(note => note.id !== parseInt(req.params.id))
        // });

    } else {
        //bad request
        res.status(400).json({msg: `No member with the id of ${req.params.id}`});
    }
});


module.exports = router;