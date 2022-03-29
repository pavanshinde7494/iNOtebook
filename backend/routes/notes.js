const express = require("express");
const fetchUser = require("../middleware/fetchUser");
const router = express.Router();
const Notes = require("../models/Notes");

const { body, validationResult } = require("express-validator");
const { findById } = require("../models/Notes");

// const fetchUser = require('../middleware/fetchUser');

//ROUTE 1 : Fetches all notes of a particular user , Login required

router.get("/fetchallnotes", fetchUser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user });
        res.json(notes);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Internal Server error" });
    }
});

// ROUTE 2 : Create new notes "api/notes/addnote", Login required

router.post(
    "/addnote",
    [
        body("title", "Enter a Valid Title").isLength({ min: 3 }),
        body("description", "Enter a valid Description").isLength({ min: 5 }),
    ],
    fetchUser
    ,
    async (req, res) => {
        // If there are errors return bad request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {

            // making data destructuring of data from client
            const { title , description , tag} = req.body;
            const note = new Notes({
                title,
                description,
                tag,
                user : req.user
            })

            // saving data

            const savedNote = await note.save();

            res.json(savedNote);
        } catch (error) {
            console.log(error.message);
            res.status(500).json({error : "Internal Server error"});
        }
    }
);


// ROUTE 3: Upade an existing note login required


router.put('/update/:id' , fetchUser, async(req,res)=>{


    try {
        const {title , description,tag} = req.body;
        // create a new Note
        const newNote = {}

        if(title)newNote.title = title;
        if(description)newNote.description = description;
        if(tag)newNote.tag = tag

        // Find note to update

        let note = await Notes.findById(req.params.id) 
        if(note == null){
            res.status(404).send("Not Found");
            return ;
        }

        // Check if user is authorized or not
        if(note.user.toString() != req.user){
            req.status(401).send("Unauthorized User");
            return;
        }

        // Making updates in document
        note = await Notes.findByIdAndUpdate(req.params.id , { $set : newNote } , {new:true})

        res.json(note)
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error : "Internal Server error"});
    }

   
})


// ROUTE 4 : Deletion of notes , Login required

router.delete('/deletenote/:id',fetchUser ,     async (req,res)=>{


    try {
         // Find note to delete
        let note = await Notes.findById(req.params.id) 
        if(note == null){
            res.status(404).send("Not Found");
            return ;
        }

        // Check if user is authorized or not
        if(note.user.toString() != req.user){
            req.status(401).send("Unauthorized User");
            return;
        }

        await Notes.findByIdAndDelete(req.params.id);

        res.json({Success : `Note with id : ${req.params.id} is successfully deleted`})
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error : "Internal Server error"});
    }
    
})

module.exports = router;
