const validator = require('validator');

const validateSignUpData = req => {
    const {firstName, lastName, emailId, password} = req.body;
    if(!firstName || !lastName) throw new Error('name not present');
    if(!validator.isEmail(emailId)) throw new Error('email isnt validated');
    if(!validator.isStrongPassword(password)) throw new Error('password isnt validated');
}

const validateEditProfileData = data => {
    const allowedUpdates = ['firstName','lastName','userId', 'photoUrl', 'about', 'age', 'skills', 'gender'];
    const isUpdateAllowed = Object.keys(data).every((k) => allowedUpdates.includes(k));

    if(!isUpdateAllowed){
        throw new Error('Update not allowed');
    }
    if(data?.skills?.length > 5){
        throw new Errpr('Max 5 sills are allowed');
    }

    return isUpdateAllowed;
}

module.exports = {validateSignUpData,validateEditProfileData}