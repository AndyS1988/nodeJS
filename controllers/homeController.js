"use strict";

const courses = [
    {
        title: "Event Loop Cakes",
        cost: 100
    },
    {
        title: "Asynchronous Dips",
        cost: 200
    },
    {
        title: "Pure Fondue",
        cost: 300
    }
]

module.exports = {
    showHomePage: (req, res) => {
        res.render("index");
    },
    showCourses: (req, res) => {
        res.render("courses", {offeredCourses: courses});
    },
    showSignUp: (req, res) => {
        res.render("contact");
    },
    postedSignUpForm: (req, res) => {
        res.render("thanks");
    }
}