const jwt = require("jsonwebtoken");
const Register = require("../models/register-model");

const auth = async(req, res, next) => {
    try {
        const token = req.cookies.jwt; //this is stored cookie token in browser
        const varifyUser = jwt.verify(token, process.env.SECRET_KEY); //here varified with db stored token
        console.log(varifyUser);
        const user = await Register.findOne({ _id: varifyUser._id }); //left side id unique key db id and write side token id
        console.log(user);

        req.token = token;
        req.user = user;

        next();
    } catch (error) {
        res.status(401).send(error);
    }
}

module.exports = auth;