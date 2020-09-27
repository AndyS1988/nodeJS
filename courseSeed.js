"use strict";

const mongoose = require("mongoose"),
  Course = require("./models/course");
mongoose.Promise = global.Promise;
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/recipe_db",
  { useNewUrlParser: true }
);
Course.remove({})
  .then(() => {
    return Course.create({
      title: "Event Loop Cakes",
      description: "Learn how to cake.",
      maxStudents: 20,
      price: 350,
      zipCode: 54321
    });
  })
  .then(course => console.log(course.title))
  .then(() => {
    return Course.create({
        title: "Pure Fondue",
        description: "Learn how to fondue.",
        maxStudents: 30,
        price: 150,
        zipCode: 12345
    });
  })
  .then(course => console.log(course.title))
  .then(() => {
    return Course.create({
        title: "Class based Stakes",
        description: "Learn how to stake.",
        maxStudents: 25,
        price: 400,
        zipCode: 54321
    });
  })
  .then(course => console.log(course.title))
  .catch(error => console.log(error.message))
  .then(() => {
    console.log("DONE");
    mongoose.connection.close();
  });