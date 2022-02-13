require('dotenv').config();
const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
require("./db/conn");
const bcrypt = require("bcryptjs");
const Register = require("./models/register-model");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth");



//  HERE I AM DECLARING SERVER PORT NO
const port = process.env.PORT || 3000;

//  HERE I AM ADDING  PATH OF PUBLIC FOR HTML CODE
const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");
console.log(static_path);
console.log(template_path);
console.log(partials_path);
app.use(express.json());
// this code written for form output showing for url and db
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

// console.log(process.env.SECRET_KEY);
// HERE I AM ROUTING HOME PAGE OF APPLICATION
app.get("/", (req, res) => {
    res.render("index");
});
// app.get("/about", (req, res) => {
//     res.render("about");
// });
app.get("/contact", auth, (req, res) => {
    // console.log(`This is the cookie Awesome for login ${req.cookies.jwt}`);
    res.render("contact");
});
app.get("/logout", auth, async(req, res) => {
    try {
        console.log(req.user);
        // FOR LOGOUT FOR SINGLE DEVICES
        req.user.tokens = req.user.tokens.filter((currElement) => {
            return currElement.token !== req.token // this code if multiple machine login then at a time one system u logged out
        });

        //  req.user.tokens = []; // FOR LOGOUT FOR MULTIPLE DEVICES


        res.clearCookie("jwt");
        console.log("Logout Successfully!");
        await req.user.save();
        res.render("/login");
    } catch (error) {
        req.status(401).send(error);
    }

    res.render("contact");
});
app.get("/login", (req, res) => {
    res.render("login");
});
app.get("/register", (req, res) => {
    res.render("register");
});
app.post("/register", async(req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;
        if (password === cpassword) {
            const registerEmployee = new Register({
                firstname: req.body.firstname, //write side key same as schema declare key
                lastname: req.body.lastname,
                email: req.body.email,
                age: req.body.age,
                gender: req.body.gender,
                phone: req.body.phone,
                password: password,
                confirmpassword: cpassword,
            });
            // here i am using token generation method
            console.log("the Success part" + registerEmployee);

            const token = await registerEmployee.generateAuthToken();
            console.log("the Token part" + token);

            // here i am using token generation method end

            //THE res.cookie() FUNCTION IS USED TO SET THE COOKIE NAME TO VALUE.
            //THE VALUE PARAMETER MAY BE A STRING OR OBJECT CONVERTED TO JSON
            //SYNTAX              res.cookie(name,value,[option])
            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 30000),
                httpOnly: true
            });
            console.log(cookie);
            //top code is cookie savin for registration page
            const registered = await registerEmployee.save();
            console.log("this is the registered" + registered);

            res.status(201).render("index");

        } else {
            res.send("password are not matching");
        }
    } catch (err) {
        res.status(400).send(err);
        console.log("the error part of the page");
    }
});
// HERE LOGIN CHECKING USER VALID OR NOT
app.post("/login", async(req, res) => {
    try {
        const email = req.body.email; //right side name is exactly match to html code name assigned key and enter by user
        const password = req.body.password;
        const userEmail = await Register.findOne({ email: email }); //left side db key and write side declare email variable

        // HERE I AM COMPARING WITH HASHING PASSWORD WITH ACTUAL PASSWORD

        const isMatch = await bcrypt.compare(password, userEmail.password); //left side user password and right side db password it means hashing password

        // HERE I AM COMPARING WITH HASHING PASSWORD WITH ACTUAL PASSWORD
        const token = await userEmail.generateAuthToken();
        console.log("the Login Token part" + token);

        //THE res.cookie() FUNCTION IS USED TO SET THE COOKIE NAME TO VALUE.
        //THE VALUE PARAMETER MAY BE A STRING OR OBJECT CONVERTED TO JSON
        //SYNTAX              res.cookie(name,value,[option])
        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 50000),
            httpOnly: true,
            // secure: true
        });
        // console.log(cookie);
        //top code is cookie savin for Login page

        // userEmail.password === password
        if (isMatch) { //left side password are db key and right side password are user puting password in ui
            res.status(201).render("index");
        } else {
            res.send("Envalid Login Details !")
        }
    } catch (err) {
        res.status(400).send("Envalid Login Details !");
    }
});
// app.get('*', function(req, res, next) {
//     res.render("<h1>Can't find this page 404 not found OOP'S !</h1>");
// });

// HERE I AM USING BCRYPTION CODE FOR REGISTER AND LOGIN FORM

// const bcrypt = require("bcryptjs");
// const securePassword = async(password) => {
//     const passwordHash = await bcrypt.hash(password, 10);
//     console.log(passwordHash);
//     const passwordMatch = await bcrypt.compare(password, passwordHash); //left side userpassword right side db bcryptpassword
//     console.log(passwordMatch);
// }
// securePassword("123");


// HERE I AM WRITING TOKEN GENERATION CODE CONCEPT

// const createToken = async() => {
//     const token = await jwt.sign({ _id: "" }, "deepaksinghsahabkudrakaimurbiharkarhnewalasbmerimakakripah", {
//         expiresIn: "2 minutes"
//     });
//     console.log(token);
//     const userVarification = await jwt.verify(token, "deepaksinghsahabkudrakaimurbiharkarhnewalasbmerimakakripah");
//     console.log(userVarification);
// }
// createToken();

app.listen(port, () => {
    console.log(`Server is Listening The Port No ${port}`);
});