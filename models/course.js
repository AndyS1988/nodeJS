"use strict";

const mongoose = require("mongoose"),
 { Schema } = mongoose;

const courseSchema = new Schema({
    title: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
      required: true
    },
    maxStudents: {
      type: Number,
      default: 0,
      min: [0, "Course cannot have a negative number of students"]
    },
    price: {
        type: Number,
        default: 0,
        min: [0, "Course cannot have a negative price"],
        required: true
    },
    zipCode: {
      type: Number,
      min: [10000, "Zip code entered was too short, please try again"],
      max: 90000
    }
  },
  {
    timestamps: true
  });

  module.exports = mongoose.model("Course", courseSchema);