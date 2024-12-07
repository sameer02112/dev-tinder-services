const express = require('express');
const connectDB = require('./config/database');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const {validateSignUpData} = require('./utils/validation');
const User = require('./models/user');
const {userAuth} = require('./middlewares/auth');
const app = express();
const cors = require('cors');

connectDB()
  .then(() => {
    console.log("DB connected");
    app.listen(3000, () => {
      console.log("server started!");
    });
  })
  .catch((err) => {
    console.log("err!");
});

// Middleware to handle CORS
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
})); 

// Middleware to get req data   
app.use(express.json());

// Middleware to access cookie
app.use(cookieParser());

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');

app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',requestRouter);


// get user by email
// app.get('/user', async (req,res) => {
//     const userEmail =  req.body.emailId;
//     try{
//         const user = await User.find({emailId: userEmail});
//         if(user.length === 0){
//             res.status(401).send("User not found!");
//         }else{
//             res.send(user);
//         }
//     }catch(err){
//         res.status(400).send('Err' + err.message);
//     }
// })

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
