const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;

    if (!token) res.status(401).send('Please Login');

    const decodedMsg = await jwt.verify(token, "DEVTINDER");
    const { _id } = decodedMsg;
    console.log('decodedMsg',decodedMsg)
    console.log('id',_id)
    const user = await User.findById(_id);
    console.log('user',user)

    if (!user) throw new Error("User not found!");

    req.user = user;
    next();
    
  } catch (err) {
    res.status(400).send("Err1 " + err.message);
  }
};

module.exports = { userAuth };
