const express = require('express');
const profileRouter = express.Router();
const {userAuth} = require('./../middlewares/auth');
const {validateEditProfileData} = require('../utils/validation');
const User = require('./../models/user')

// Profile View
profileRouter.get('/profile/view', userAuth , async (req,res) => {
    try{
        res.send(req.user);
    }catch(err){
        res.status(400).send('Err -- ' + err.message);
    }
})

// Profile Edit
profileRouter.put('/profile/edit', userAuth, async (req,res) => {
    const data = req.body;
    const id = req.user._id.toString()
    try{
        if(!validateEditProfileData(data)) throw new Error('Invalid edit request');
        const user = await User.findByIdAndUpdate(id, data, {
            returnDocument: "after",
            runValidators: true
        });
        res.json({message: 'success', data: user});
    }catch(err){
        res.status(400).send(err.message);
    }
})

// Profile Edit Password
profileRouter.post('/profile/edit/password', userAuth, async(req,res) => {
    try{

    }catch(err){
        res.status(400).send(err.message);
    }
})

module.exports = profileRouter;