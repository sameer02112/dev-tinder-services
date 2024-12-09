const express = require('express');
const authRouter = express.Router();
const {validateSignUpData} = require('../utils/validation');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');

// Middleware to access cookie
authRouter.use(cookieParser());

//Sign Up
authRouter.post('/signup', async (req,res) => {
    const {firstName, lastName, emailId,  password} = req.body;
    const initialPhotoUrl = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png";
    try{
        validateSignUpData(req);
        const {password} = req.body;
        const passwordHash = await bcrypt.hash(password,10);

        const user = new User({
            firstName, lastName, emailId, password: passwordHash, photoUrl : initialPhotoUrl
        });

        await user.save();
        res.send('user added!');
    }catch(err){
        res.status(400).send(err.message);
    }
})

//Login
authRouter.post('/login', async (req,res)=> {
    try{
        const {emailId, password} = req.body;

        const user = await User.findOne({emailId: emailId});
        if(!user) throw new Error('Invalid Credential');

        const isPasswordValid = await user.validatePassword(password);
        if(!isPasswordValid) throw new Error('Invalid Credential');
        else{
            // create JWT token
            const token = await user.getJWT();

            // add token to cookie
            res.cookie('token', token);

            // send response 
            res.send(user);
        }

    }catch(err){
        res.status(400).send("ERROR-" + err.message);
    }
})

// Logout
authRouter.post('/logout', async (req,res) => {
    res.cookie("token", null ,{
        expires: new Date(Date.now()),
    })
    res.send('success');
})


// Delete
authRouter.delete('/delete', async (req,res) => {
    try{    
        const id = req?.query?.id;
        await User.findByIdAndDelete(id);
        res.send('Profile deleted!');
    }catch(err){
        res.status(400).send('err-' + err.message);
    }
})



module.exports = authRouter;