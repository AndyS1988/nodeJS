"use strict";

const mongoose = require("mongoose"),
  Subscriber = require("./models/subscriber")

mongoose.connect(
  "mongodb://localhost:27017/recipe_db",
  { useNewUrlParser: true }
);
mongoose.connection;

// this is where all contacts would be stored before getting pushed into the db (righn now I should enter manually all the entries I already have in the db)
var contacts = [];

Subscriber.deleteMany()
  .exec()
  .then(() => {
    console.log("Subscriber data is empty!");
  });

var commands = [];

contacts.forEach(c => {
  commands.push(
    Subscriber.create({
      name: c.name,
      email: c.email,
      zipCode: c.zipCode
    })
  );
});

Promise.all(commands)
  .then(r => {
    console.log(JSON.stringify(r));
    mongoose.connection.close();
  })
  .catch(error => {
    console.log(`ERROR: ${error}`);
  });