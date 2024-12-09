const express = require('express');
const requestRouter = express.Router();
const {userAuth} = require('../middlewares/auth');
const User = require('../models/user');
const ConnectionRequest = require('../models/connectionRequest');

// Send connection request
requestRouter.post('/request/send/:status/:toUserId', userAuth, async (req,res) => {
    try{
       const fromUserId = req?.user?._id;
       const toUserId = req?.params?.toUserId;
       const status = req?.params?.status;

    // Status validation
       const allowedStatus = ["ignored","interested"];
       if(!allowedStatus.includes(status)){
        return res.status(400).json({message : 'Invalid status type' + status});
       }

    // Check if toUser is present in DB
       const toUser = await User.findById(toUserId);
       if(!toUser){
        return res.status(400).json({message : 'User not found'});
       }

    // Restrict conditions
       const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
            {fromUserId, toUserId},
            {fromUserId: toUserId, toUserId: fromUserId}
        ]
       })

       if(existingConnectionRequest){
        return res.status(400).json({message : 'Duplicate connection request'});
       }

       const connectionRequest = new ConnectionRequest({fromUserId,toUserId,status});

       const data = await connectionRequest.save();
       res.json({'message': 'connection request sent successfully', 'data': data});

    }catch(err){
        res.status(400).send('Err' + err.message);
    }
})

// Accept/Reject connection request
requestRouter.post("/request/review/:status/:requestId", userAuth,  async (req,res) => {
   try {
    const user = req?.user;
    const status = req?.params?.status;
    const requestId = req?.params?.requestId;

    const allowedStatus = ["accepted", "rejected"];
    if(!allowedStatus.includes(status)){
        return res.status(400).json({message : 'Status not allowed'});
    }
    
    const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: user?.id,
        status: 'interested'
    })

    if(!connectionRequest){
        return res.status(404).json({message : 'Connection request not found'});
    }

    connectionRequest.status = status;
    const data = await connectionRequest.save();

    res.send(data);

   } catch (err) {
     res.status(400).send("Err" + err.message);
   }
})


module.exports = requestRouter;