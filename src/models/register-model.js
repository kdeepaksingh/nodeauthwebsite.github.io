const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const employeeSchema = new mongoose.Schema({
    firstname: {
        type: String, //firstname means key exactly same as we are passing name fields in html code in forms
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    confirmpassword: {
        type: String,
        required: true,
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

//  HERE I AM GENERATING THE TOKENS
employeeSchema.methods.generateAuthToken = async function() {
    try {
        console.log(this._id);
        const token = jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    } catch (error) {
        res.send("the Error Part " + error);
        console.log("The Error Pat " + error);
    }
}


//  HERE I AM USING HASHING PASSWORD WHEN I AM SAVING THEN WE ARE DOING ENCRYPTION OF PASSWORD

employeeSchema.pre("save", async function(next) {
    if (this.isModified("password")) {
        // console.log(`The Current Password is ${this.password}`); // here original password is coming which is enter by user
        this.password = await bcrypt.hash(this.password, 10); // this code is using for hashing the password 
        // console.log(`Bcypted password is ${this.password}`);
        this.confirmpassword = await bcrypt.hash(this.password, 10);
        // this.confirmpassword = undefined; //for confirm password not showing original password that's why i added this code for removed from db
    }
    next(); //this next is using like this if not added then refreshing taking time so next method is calling
});


// HERE I AM CREATING COLLECTION OF THE SCHEMA
const Register = new mongoose.model("Register", employeeSchema);

// HERE I AM EXPORTING COLLECTION OF THE SCHEMA

module.exports = Register;