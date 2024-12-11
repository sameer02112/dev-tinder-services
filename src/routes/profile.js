const express = require('express');
const profileRouter = express.Router();
const {userAuth} = require('./../middlewares/auth');
const {validateEditProfileData} = require('../utils/validation');
const User = require('./../models/user');
const fs = require('fs');
const Image = require('./../models/image');
const multer = require('multer');

const upload = multer({
    storage: multer.memoryStorage(),
});


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


// Profile Picture save
profileRouter.post("/profile/image/", userAuth, upload.single('profilePicture') , async (req, res) => {
  try {
    const loggedInUser = req?.user;
    const imgData = req?.file?.buffer;
    const mimeType = req?.file?.mimetype;

    console.log('loggedInUser',loggedInUser)
    console.log('loggedInUser._id',loggedInUser._id)
    console.log('loggedInUser._id.toString()',loggedInUser._id)
    const image = new Image({
      userId: loggedInUser._id.toString(),
      profilePicture: {
        data: imgData,
        contentType : mimeType,
      },
    });

    await image.save();
    res.send("Image saved successfully!");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Profile picture fetch
profileRouter.get('/profile/image', userAuth, async (req,res) => {
    try{
        const loggedInUser = req?.user;
        const img = await Image.findOne({userId: loggedInUser._id});

        res.set('Content-Type', img?.profilePicture?.contentType);
        res.send(img?.profilePicture?.data);
    }catch(err){
        res.status(400).send(err.message);
    }
})


module.exports = profileRouter;