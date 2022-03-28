const express = require('express');
const User = require('../models/User');

const router = express.Router();
const {body , validationResult} = require('express-validator');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');


// create a user using post . Doesn't require auth

router.post('/createuser' ,[
    body('name','Enter a Valid name').isLength({min : 3}),
    body('email','Enter a valid Email').isEmail(),
    body('password','Password must be at least 5 characters').isLength({ min: 5 }),
]
,async(req,res)=>{
    // If there are errors return bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Check whether user with this email exists
    try{
        let user = await User.findOne({
            email : req.body.email
        });
        if(user){ 
            return res.status(400).json({
                error : "Sorry , This email already exists",
                email : user.email
            })
        }
        

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password , salt);

        // Creating a new user
        user = await User.create({
            name: req.body.name,
            email : req.body.email,     
            password: secPass
        })

        const data = {
            user : user._id
        }

        const authToken = jwt.sign(data, 'secret');
        res.json({authToken});
    }
    catch(err){
        console.log(err)
        res.status(500).json({
            msg : err.message
        });
    }

})






module.exports = router;