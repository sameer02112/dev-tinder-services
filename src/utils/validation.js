const validator = require('validator');

const validateSignUpData = req => {
    const {firstName, lastName, emailId, password} = req.body;
    if(!firstName || !lastName) throw new Error('name not present');
    if(!validator.isEmail(emailId)) throw new Error('email isnt validated');
    if(!validator.isStrongPassword(password)) throw new Error('password isnt validated');
}

module.exports = {validateSignUpData}