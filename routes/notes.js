const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/Getuserdata');
const Notes = require('../models/notes')
// Get all the notes
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    const notes = await Notes.find({ user: req.user.id });

    res.json(notes);
})
router.post('/addnotes', fetchuser,
    [body('title', "Title too Short").isLength({ min: 5 }), body('description', "Description too Short").isLength({ min: 5 })],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { description, title, tag } = req.body;
            let note = await Notes.create
                ({
                    description, title, tag, user: req.user.id
                })
            // console.log("I am Heree");
            res.json(note);
        } catch (error) {
            res.send("Error Occured");
        }
    })
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    // if(!id)
    //  return res.status(404).send('Not Found');

    // Create New node object
    const newNote = {};
    if (title) { newNote.title = title }
    if (description) { newNote.description = description }
    if (tag) { newNote.tag = tag }
    var note = await Notes.findById(req.params.id);
    if (!note) {
        return res.status(404).send('Not Found 2');
    }
    // Check if the user are same  ie owner of the note and editor are same
    //;
    if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed");
    }
    // Update The preExisting Note
    // Adding a new "new" object and marking it true to the note when updated
    note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
    res.json({ note });

})
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
    // const {title,description,tag} = req.body;
    try {
        
    
    var note = await Notes.findById(req.params.id);
    if (!note) {
        return res.status(404).send('Not Found 2');
    }
    if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed");
    }
    Notes.findByIdAndDelete(req.params.id, function (err, docs) {
        if (err) {
            console.log(err)
        }
        else {
            console.log("Deleted : ", docs);
        }
    });
} catch (error) {
         console.log(error.message);
         res.status(500).send("Internal Server Error Occured");
}
})
module.exports = router;