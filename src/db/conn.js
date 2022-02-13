const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/signUp-api", {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    console.log("MongoDb Connection Established Successfully!");
}).catch(() => {
    console.log("Something Error Happened In From Db Side !");
});