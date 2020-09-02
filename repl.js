const mongoose = require("mongoose");
const Courses = require("./models/course");
const Subscriber = require("./models/subscriber");
  
mongoose.connect(
  "mongodb://localhost:27017/project_db",
   { useNewUrlParser: true }
);
mongoose.Promise = global.Promise;

mongoose.set("useCreateIndex", true);
const db = mongoose.connection;
  
db.once("open", () => {
    console.log("Successfully connected to MongoDB using Mongoose!");
});  