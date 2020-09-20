"use strict"

const router = require("express").Router(),
    homeController = require("../controllers/homeController");

router.get("/", homeController.showHomePage);
router.get("/chat", homeController.chat);

module.exports = router;
