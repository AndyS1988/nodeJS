"use strict";
//Import and destructure Router:
const { Router } = require("express");
//Rest of the imports: 
const express = require("express"),
  app = express(),
  router = Router(),
  layouts = require("express-ejs-layouts"),
  methodOverride = require("method-override"),
  mongoose = require("mongoose"),
  expressSession = require("express-session"),
  cookieParser = require("cookie-parser"),
  connectFlash = require("connect-flash"),
 // expressValidator = require("express-validator"), -> breaking changes introduced in latest version
  homeController = require("./controllers/homeController"),
  errorController = require("./controllers/errorController"),
  subscribersController = require("./controllers/subscribersController"),
  coursesController = require("./controllers/coursesController"),
  usersController = require("./controllers/usersController");

//making sure I can use ES6 promise:  
mongoose.Promise = global.Promise;
  
mongoose.connect(
  "mongodb://localhost:27017/project_db",
   { useNewUrlParser: true }
);
mongoose.set("useCreateIndex", true);
const db = mongoose.connection;
  
db.once("open", () => {
  console.log("Successfully connected to MongoDB using Mongoose!");
});

app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");
app.use(express.static('./public'));
app.use(layouts);
app.use(
    express.urlencoded({
      extended: false
    })
);

router.use(
  methodOverride("_method", {
    methods: ["POST", "GET"]
  })
);

app.use(express.json());
router.use(cookieParser(process.env.PASSWORD)); //using environmetnal var -> nano .bash_profile to create a new password var, printenv to view the environment
router.use(expressSession({
  secret: process.env.PASSWORD,
  cookie: {
    maxAge: 4000000
  },
  resave: false,
  saveUninitialized: false
}));
router.use(connectFlash());
//should the next be in controllers?
router.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  next();
});


app.use("/", router);
//router.use(expressValidator());

//Defining routes:

router.get("/", homeController.showHomePage);

router.get("/users", usersController.index, usersController.indexView);
router.get("/users/new", usersController.new);
router.post("/users/create", usersController.create, usersController.redirectView);
router.get("/users/login", usersController.login);
router.post("/users/login", usersController.authenticate, usersController.redirectView);
router.get("/users/:id/edit", usersController.edit);
router.put("/users/:id/update", usersController.update, usersController.redirectView);
router.delete("/users/:id/delete", usersController.delete, usersController.redirectView);
router.get("/users/:id", usersController.show, usersController.showView);

router.get("/courses", coursesController.index, coursesController.indexView);
router.get("/courses/new", coursesController.new);
router.post("/courses/create", coursesController.create, coursesController.redirectView);
router.get("/courses/:id/edit", coursesController.edit);
router.put("/courses/:id/update", coursesController.update, coursesController.redirectView);
router.delete("/courses/:id/delete", coursesController.delete, coursesController.redirectView);
router.get("/courses/:id", coursesController.show, coursesController.showView);

router.get("/subscribers", subscribersController.index, subscribersController.indexView);
router.get("/subscribers/new", subscribersController.new);
router.post("/subscribers/create", subscribersController.create, subscribersController.redirectView);
router.get("/subscribers/:id/edit", subscribersController.edit);
router.put("/subscribers/:id/update", subscribersController.update, subscribersController.redirectView);
router.delete("/subscribers/:id/delete", subscribersController.delete, subscribersController.redirectView);
router.get("/subscribers/:id", subscribersController.show, subscribersController.showView);


app.use(errorController.pageNotFound);
app.use(errorController.internalServerError);

app.listen(app.get("port"), () => {
    console.log(`Server running at http://localhost:${app.get("port")}`);
});