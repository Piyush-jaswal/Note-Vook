const express = require('express');
const User = require("../models/User");
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const router = express.Router();
const fetchuser = require('../middleware/Getuserdata')
const JWT_SECRET_STRING = "KingisPiyush,PiyushisKing";
const { body, validationResult } = require('express-validator');
//Route 1
//Create a user using : Post "/api/auth" Doesnt req auth
//2nd param is a validation Check  
router.post('/createuser', [body('email',"Enter a Valid Mail").isEmail(), body('name', "Name too short").isLength({ min: 5 }), body('password','Password must be 8 char long').isLength({ min: 5 })],
    async (req, res) => {
        //console.log(req.body);

        // res.json([]);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            let done = false;
            let user = await User.findOne({ email: req.body.email })
            if (user) {
                return res.status(400).json({done, errors: "Mail already in use" });
            }
            else {
                const salt = await bcrypt.genSalt(10); 
                const secPassword = await bcrypt.hash(req.body.password,salt);
                user = await User.create({
                    name: req.body.name,
                    password: secPassword,
                    email: req.body.email
                });
                // .then(user=> res.json(user))
                // .catch(err=>{
                //     console.log(err)
                //     res.json({error: "Mail id already in use"})});
                // const user = User(req.body);
                // user.save();
                const data = {
                    user: {id: user.id}
                };
                //Converts id of the user into token
                done = true;
                   const authToken = jwt.sign(data,JWT_SECRET_STRING);
                   res.send({done,authToken});
                   
            }
            } catch (error) {
                console.error(error.message);
                res.status(500).send("Something bad happened");
            }

        
})
//ROUTE 1
// Authenticate an Existing User
router.post('/login', [body('email',"Please Enter a valid Email").isEmail(), body('password',"Password Cannot be Empty").isLength(1)],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({Error: errors.array()});
        }
        
        try {
            let done = false;
            const {email,password} = req.body;
            let user = await User.findOne({ email: req.body.email })
            if (!user)
            {
                return res.status(400).json({done, errors: "Wrong Credentials0"});
            }
            else
            {
                const passCompare =await bcrypt.compare(password,user.password);
                if (passCompare)
                {   
                    const data = {
                        user: {id: user.id}
                    };
                       const authToken = jwt.sign(data,JWT_SECRET_STRING);
                       done = true;
                       res.json({done,authToken});
                  // return res.json({ errors: "Right Credentials1"});
                }
                else{
                    console.log("Wrong Credential");
                    return res.json({done, message: "Wrong Credentials"})
                
                }
                
            }

        } catch (error) {
                   console.log("Error Occured");
                   res.json({error});
        }



    })
    // GET Logged-in Details Of User Login is required Before
    router.post('/getdetails',fetchuser,
    async (req, res) => {
          try {
            const _id = req.user.id;
            const user = await User.findById(_id).select("-password");
            res.json(user);
          } catch (error) {
             console.error(error.message);
             req.send("Internal Server Error");
          }

    })
module.exports = router;