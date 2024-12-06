const express = require('express');
const authRouter = express.Router();
const {validateSignUpData} = require('../utils/validation');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//Sign Up
authRouter.post('/signup', async (req,res) => {
    const {firstName, lastName, emailId, photoUrl, password} = req.body;
    try{
        validateSignUpData(req);
        const {password} = req.body;
        const passwordHash = await bcrypt.hash(password,10);

        const user = new User({
            firstName, lastName, emailId, photoUrl, password: passwordHash
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
        console.log('user',user)
        if(!user) throw new Error('Invalid Credential');

        const isPasswordValid = await user.validatePassword(password);
        if(!isPasswordValid) throw new Error('Invalid Credential');
        else{
            // create JWT token
            const token = await user.getJWT();

            console.log('token',token)
            // add token to cookie
            res.cookie('token', token);

            // send response 
            res.send(user);
        }

    }catch(err){
        res.status(400).send(err.message);
    }
})

// Logout
authRouter.post('/logout', async (req,res) => {
    res.cookie('token', null ,{
        expires: new Date(Date.now()),
    })
    res.send('success')
})


module.exports = authRouter;