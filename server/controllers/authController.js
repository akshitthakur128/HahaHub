const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { error, success } = require('../utlis/responseWrapper');
const signupController = async(req, res) => {
    try{
        // Took the data out from the body
        const {email, password} = req.body;

        // Now basically as a validation, we checked whether the user has filled email and password or not
        if(!email || !password){
            // return res.status(400).send("All fields are reqiured");
            return res.send(error(400, "All fields are reqiured"));
        }
        
        // Then we are checking if the user is present already or not, if yes then we are just exiting from here
        const oldUser = await User.findOne({email});
        if(oldUser){
            // return res.status(409).send('User is already registered');
            return res.send(error(409, 'User is already registered'));

        }
        // Now the password cannot be stored directly, so we are first hashing the password then we are storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        // Creating a new user, create function used below is basically a function in mongoose
        const user = await User.create({
            email, 
            password:hashedPassword
        })

        // return res.status(201).json({
        //     user,
        // })
        return res.send(success(201,{
                user,
            } ))

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
            // return res.status(400).send("All fields are reqiured");
            return res.send(error(400, "All fields are reqiured"));
        }
        
        // Then we are checking if the user is present already or not, if yes then we are just exiting from here
        const user = await User.findOne({email});
        if(!user){
            // return res.status(404).send('User is not registered');
            return res.send(error(404, 'User is not registered'));
        }

        const matched = await bcrypt.compare(password, user.password);
        if(!matched){
            // return res.status(403).send('Incorrect password');
            return res.send(error(403, 'Incorrect password'));
        }
        
        const accessToken = generateAccessToken({_id: user._id});
        const refreshToken = generateRefreshToken({_id: user._id});

        res.cookie('jwt', refreshToken, {
            httpOnly:true,
            secure:true
        })
        // return res.json({accessToken});
        return res.send(success(200, {accessToken}));
    }catch(error){
        console.log(error);
    }

}

// this api will check the refresh token validity and generate a new access token
const refreshAccessTokenController = async (req, res) =>{
    // const {refreshToken} = req.body;
    const cookies = req.cookies;
    if(!cookies.jwt) {
        // return res.status(401).send('Refresh token in cookie is required');
        return res.send(error(401, 'Refresh token in cookie is required'));
    }
    const refreshToken = cookies.jwt;
    try{
        const decoded =  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_PRIVATE_KEY);
        const _id = decoded._id;
        const accessToken = generateAccessToken({_id});
        
        // return res.status(201).json({accessToken});
        return res.send(success(201, {accessToken}));

    }
    catch(error){
        console.log(error);
        // return res.status(401).send("Invalid refresh token");
        return res.send(error(401, "Invalid refresh token"  ));
    }
}
// Internal Functions

const generateAccessToken = (data) => { 
    try { 
    const token = jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
        expiresIn: '15m',
    });
    console.log(token);
    return token;
    }
    catch {
        console.log(error);
    }
}

const generateRefreshToken = (data) => { 
    try { 
    const token = jwt.sign(data, process.env.REFRESH_TOKEN_PRIVATE_KEY, {
        expiresIn: '1y',
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
    loginController,
    refreshAccessTokenController 
}