"use strict";

module.exports = {
    showHomePage: (req, res) => {
        res.render("index");
    },
    chat: (req, res) => {
        res.render("chat");
    }
}