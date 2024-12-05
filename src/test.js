const express = require('express');
const {adminAuth, userAuth} = require('./middlewares/auth')

const app = express();

app.listen(3000, ()=> {
    console.log('successfully started');
});

// this will match to all the routes
// app.use('/test',(req,res)=>{
//     res.send('hello');
// })


// Middleware way1
// app.use('/admin', (req,res,next) => {
//     const token = '123';
//     const isValid = token === '123';
//     if(!isValid){
//         res.status(401).send('err');
//     }else{
//         next();
//     }
// })

// Middleware way2
app.use('/admin',adminAuth);

app.get('/admin/getData', (req,res) => {
    res.send('Authorized');
})

app.get('/user/:id', (req,res) => {
    console.log(req.query)  //query params http://localhost:3000/user?userId=1&name=a
    console.log(req.params) // params http://localhost:3000/user/11?userId=1&name=a
    res.send('fetch user data');
})

app.post('/user', userAuth, (req,res) => {
    res.send('save user data');
})

app.use('/test', (req,res,next) => {
    console.log('first req printed');
    next();  //middleware
}, (req,res) => {
    console.log('second req printed');
    res.send('done') //request handler
})

app.use('/', (err,req,res,next) => {
    if(err){
        res.status(500).send('Err occured');
    }
})