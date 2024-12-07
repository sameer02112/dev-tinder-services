const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const userRouter = express.Router();

// GET all pending connection request for logged in user
userRouter.get('/user/request/recieved', userAuth, async (req,res) => {
    try{
        const user = req.user;
        const connectionRequest = await ConnectionRequest.find({
            toUserId: user._id,
            status: 'interested'
        }).populate("fromUserId", ["firstName","lastName","age","gender","about","photoUrl"]);

        res.send(connectionRequest);
    }catch(err){
        res.status(400).json({message: 'err' + err})
    }
})

// GET all connections
userRouter.get('user/connection', userAuth, async (req,res) => {
    const USER_DATA_To_FETCH = ["firstName","lastName","age","gender","about","photoUrl"];
    try {
      const user = req.user;
      const connectionRequest = await ConnectionRequest.find({
        $or: [
          { toUserId: user._id, status: "accepted" },
          { fromUserId: user._id, status: "accepted" },
        ],
      })
        .populate("fromUserId", USER_DATA_To_FETCH)
        .populate("toUserID", USER_DATA_To_FETCH);

      const data = connectionRequest.map((row) => {
        if(row.fromUserId._id.toString() == user._id.toString()) return row.toUserId;
        else return row.fromUserId;
      });
      
      res.send(data);
    } catch (err) {
      res.status(400).json({ message: "err" + err });
    }
})

module.exports = userRouter;