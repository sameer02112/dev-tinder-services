const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const userSchema = mongoose.Schema(
  {
    // _id:{
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Image"
    // },
    firstName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 20,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value){
        if(!validator.isEmail(value)){
            throw new Error("Invalid email");
        }
      }
    },
    password: {
      type: String,
      validate(value){
        if(!validator.isStrongPassword(value)){
            throw new Error('Use a strong password');
        }
      }
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender data isn't valid");
        }
      },
    },
    photoUrl: {
      type: String,
      //  ref: "Image"
    },
    uploadedPhotoId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Image"
    },
    about: {
      type: String,
      default: "initial default value added",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function(){
    const user = this;
    const token = await jwt.sign({_id: user._id}, "DEVTINDER", {expiresIn: '1d'});
    return token;
}

userSchema.methods.validatePassword = async function(passwordEnteredByUser){
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(passwordEnteredByUser, passwordHash);
    return isPasswordValid;
}

userSchema.pre("save", function(next){
  if(!this.uploadedPhotoId){
    this.uploadedPhotoId = this._id;
  }
  next();
})

const User = mongoose.model("User", userSchema);
module.exports = User;
