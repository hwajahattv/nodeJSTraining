const mongoose = require("mongoose");

mongoose.connect(
    "mongodb+srv://wajahat:44EHItu0zlOFoNof@cluster0.nn2jogz.mongodb.net/",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
