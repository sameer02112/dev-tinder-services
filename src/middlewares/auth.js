const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) throw new Error("token not valid");

    const decodedMsg = await jwt.verify(token, "DEVTINDER");
    const { _id } = decodedMsg;
    const user = User.findById(_id);
    if (!user) throw new Error("User not found!");
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Err " + err.message);
  }
};

module.exports = { userAuth };