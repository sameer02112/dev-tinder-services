const express = require('express');
const requestRouter = express.Router();
const {userAuth} = require('../middlewares/auth');

// Send connection request
requestRouter.get('/sendConnectionRequest', async (req,res) => {
    try{
        res.send('sent');
    }catch(err){
        res.status(400).send('Err' + err.message);
    }
})


module.exports = requestRouter;