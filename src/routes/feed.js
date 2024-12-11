const express = require('express');
const feedRouter = express.Router();
const {userAuth} = require('../middlewares/auth');
const User = require('../models/user');
const ConnectionRequest = require('../models/connectionRequest');


feedRouter.get('/feed', userAuth , async (req,res) => {
    const loggedInUser = req?.user;

    try{
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        
        limit = limit > 20 ? 20 : limit;
        const skip = (page-1)*limit;

        const connectionRequest = await ConnectionRequest.find({
            $or:[
                {fromUserId: loggedInUser?._id}, {toUserId : loggedInUser?._id}
            ]
        }).select("fromUserId toUserId");

        const hideUserFromFeed = new Set();
        
        connectionRequest.forEach(req => {
            hideUserFromFeed.add(req?.fromUserId?.toString());
            hideUserFromFeed.add(req?.toUserId?.toString());
        })

        const users = await User.find({
            $and: [
                {_id: {$nin : Array.from(hideUserFromFeed)}},
                {_id: {$ne: loggedInUser._id}}
            ]
        }).populate({
            path: "uploadedPhotoId", // Name used for clarity
            model: "Image",  // Referencing the 'Image' model
            localField: "uploadedPhotoId", // Field in Image
            foreignField: "userId", // Field in User
          })
        res.send(users);
        
    }catch(err){
        res.status(400).send('Err ' + err.message);
    }
})

module.exports = feedRouter;