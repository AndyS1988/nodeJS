"use strict";

const mongoose = require("mongoose"),
    {Schema} = mongoose,
    Subscriber = require("./subscriber"),
    passportLocalMongoose = require("passport-local-mongoose");

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

// the plugin creates salt and hash fields on the user model & treat the email attribute as a valid field for login:
userSchema.plugin(passportLocalMongoose, {
  usernameField: "email"
});

module.exports = mongoose.model("User", userSchema);