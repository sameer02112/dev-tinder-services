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
        }).skip(skip).limit(limit);
        res.send(users);
        
    }catch(err){
        res.status(400).send('Err');
    }
})

module.exports = feedRouter;