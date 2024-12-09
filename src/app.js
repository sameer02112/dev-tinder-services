const express = require('express');
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser');
const User = require('./models/user');
const app = express();
const cors = require('cors');

connectDB()
  .then(() => {
    console.log("DB connected");
    app.listen(3000, () => {
      console.log("server started 🚀🚀🚀");
    });
  })
  .catch((err) => {
    console.log('ERROR -' + err);
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
const userRouter = require('./routes/user');
const { userAuth } = require('./middlewares/auth');

app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',requestRouter);
app.use('/',userRouter);

// get all user
app.get('/feed', userAuth , async (req,res) => {
    const id = req?.user?._id;
    try{
        const user = await User.find({ _id: { $ne: id } }); //exclude the loggedIn user id
        if(user.length === 0){
            res.status(401).send("User not found!");
        }else{
            res.send(user);
        }
    }catch(err){
        res.status(400).send('Err');
    }
})
