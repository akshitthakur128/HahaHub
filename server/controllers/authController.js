const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const signupController = async(req, res) => {
    try{
        // Took the data out from the body
        const {email, password} = req.body;

        // Now basically as a validation, we checked whether the user has filled email and password or not
        if(!email || !password){
            return res.status(400).send("All fields are reqiured");
        }
        
        // Then we are checking if the user is present already or not, if yes then we are just exiting from here
        const oldUser = await User.findOne({email});
        if(oldUser){
            return res.status(409).send('User is already registered');
        }
        // Now the password cannot be stored directly, so we are first hashing the password then we are storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        // Creating a new user, create function used below is basically a function in mongoose
        const user = await User.create({
            email, 
            password:hashedPassword
        })

        return res.status(201).json({
            user,
        })


    }catch(error){
        console.log(error);
    }
}

const loginController = async(req, res) => {
    try{
        // Took the data out from the body
        const {email, password} = req.body;

        // Now basically as a validation, we checked whether the user has filled email and password or not
        if(!email || !password){
            return res.status(400).send("All fields are reqiured");
        }
        
        // Then we are checking if the user is present already or not, if yes then we are just exiting from here
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).send('User is not registered');
        }

        const matched = await bcrypt.compare(password, user.password);
        if(!matched){
            return res.status(403).send('Incorrect password');
        }
        
        const accessToken = generateAccessToken({_id: user._id, email: user.email});
        return res.json({accessToken});
    }catch(error){
        console.log(error);
    }
}
// Internal Functions

const generateAccessToken = (data) => { 
    try { 
    const token = jwt.sign(data, 'asdfasdfawwidofnwroqppqaswiehrb', {
        expiresIn: '60s'
    });
    console.log(token);
    return token;
    }
    catch {
        console.log(error);
    }
}

module.exports = {
    signupController,
    loginController 
}