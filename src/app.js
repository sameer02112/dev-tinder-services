const express = require('express');
const connectDB = require('./config/database');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const {validateSignUpData} = require('./utils/validation');
const User = require('./models/user');
const {userAuth} = require('./middlewares/auth');
const app = express();

connectDB()
  .then(() => {
    console.log("DB connected");
    app.listen(3000, () => {
      console.log("server started!");
    });
  })
  .catch((err) => {
    console.log("err!!");
});

// Middleware to get req data   
app.use(express.json());

// Middleware to access cookie
app.use(cookieParser());

// add new user
app.post('/signup', async (req,res) => {
    const {firstName, lastName, emailId, password} = req.body;
    // let userObj = req.body;
    try{
        validateSignUpData(req);
        const {password} = req.body;
        const passwordHash = await bcrypt.hash(password,10);

        const user = new User({
            firstName, lastName, emailId, password: passwordHash
        });

        // const user = new User({...userObj, password: passwordHash })
        await user.save();
        res.send('user added!');
    }catch(err){
        res.status(400).send(err.message);
    }
})

app.post('/login', async (req,res)=> {
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
            res.send('Login Successfull!!!');
        }

    }catch(err){
        res.status(400).send(err.message);
    }
})

// profile api
app.get('/profile', userAuth , async (req,res) => {
    try{
        res.send(req.user);
    }catch(err){
        res.status(400).send('Err' + err.message);
    }
})

// get user by email
app.get('/user', async (req,res) => {
    const userEmail =  req.body.emailId;
    try{
        const user = await User.find({emailId: userEmail});
        if(user.length === 0){
            res.status(401).send("User not found!");
        }else{
            res.send(user);
        }
    }catch(err){
        res.status(400).send('Err' + err.message);
    }
})

// get all user
app.get('/feed', async (req,res) => {
    try{
        const user = await User.find({});
        if(user.length === 0){
            res.status(401).send("User not found!");
        }else{
            res.send(user);
        }
    }catch(err){
        res.status(400).send('Err');
    }
})

// delete an user

app.delete('/user', async (req,res) => {
    try{
        const id = req.body.userId;
        await User.findByIdAndDelete(id);
        res.send('User deleted!');
    }catch(err){
        res.status(400).send('Err');
    }
})

// update data of an user

app.patch('/user/:userId', async (req,res) => {
    const id = req.params?.userId;
    const data = req.body;

    try{
        const allowedUpdates = ['userId', 'photoUrl', 'about', 'age', 'skills', 'gender'];

        const isUpdateAllowed = Object.keys(data).every((k) => allowedUpdates.includes(k));
    
        if(!isUpdateAllowed){
           throw new Error('Update not allowed');
        }
        if(data?.skills.length > 5){
            throw new Errpr('Max 5 sills are allowed');
        }

        const user = awaitUser.findByIdAndUpdate(id,data,{
            returnDocument: "after",
            runValidators: true
        });
        res.send('Updated data');
    }catch(err){
        res.status(400).send('Err');
    }
})