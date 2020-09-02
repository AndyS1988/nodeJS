"use strict";

const mongoose = require("mongoose"),
    {Schema} = mongoose,
    Subscriber = require("./subscriber"),
    bcrypt = require("bcrypt");

const userSchema = new Schema({
    name: {
      first: {
          type: String,
          trim: true
      },
      last: {
        type: String,
        trim: true
      }
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true
    },
    zipCode: {
      type: Number,
      min: [10000, "Zip code entered was too short, please try again"],
      max: 90000
    },
    password: {
        type: String,
        required: true
    },
    courses: [{type: Schema.Types.ObjectId, ref: "Course"}],
    subscribedAccount: {type: Schema.Types.ObjectId, ref: "Subscriber"},
    },
    {timestamps: true}
);

userSchema.virtual("fullName")
    .get(function() {
        return `${this.name.first} ${this.name.last}`;
    })

userSchema.pre("save", function(next) {
  let user = this;
    if (user.subscribedAccount === undefined) {
      Subscriber.findOne({
        email: user.email
      })
      .then(subscriber => {
        user.subscribedAccount = subscriber;
        next();
      })
      .catch(error => {
        console.log(`Error in connecting subscriber:${error.message}`);
          next(error);
      });
    } else {
        next();
      }
});

userSchema.pre("save", function(next) {
  let user = this; //preserving context

  bcrypt.hash(user.password, 10)
    .then(hash => {
      user.password = hash;
      next();
    })
    .catch(error => {
      console.log(`Error while hashing password: ${error.message}`);
      next(error);
    });
});

userSchema.methods.passwordComparison = function(inputPassword) {
  let user = this; //preserving context
  return bcrypt.compare(inputPassword, user.password);
}

module.exports = mongoose.model("User", userSchema);