"use strict";

module.exports = {
    showHomePage: (req, res) => {
        res.render("index");
    },
    chat: (req, res) => {
        res.render("chat");
    }
    /*
    showCourses: (req, res) => {
        res.render("courses", {offeredCourses: courses});
    },
    showSignUp: (req, res) => {
        res.render("contact");
    },
    postedSignUpForm: (req, res) => {
        res.render("thanks");
    }*/
}