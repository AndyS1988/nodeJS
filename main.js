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
  expressValidator = require("express-validator"),
  passport = require("passport"),
  homeController = require("./controllers/homeController"),
  errorController = require("./controllers/errorController"),
  subscribersController = require("./controllers/subscribersController"),
  coursesController = require("./controllers/coursesController"),
  usersController = require("./controllers/usersController"),
  User = require("./models/user");

mongoose.Promise = global.Promise; //making sure I can use ES6 promise:  
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

router.use(connectFlash()); //-> allows to call flesh on any req
router.use(expressValidator());
router.use(passport.initialize());
router.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

router.use((req, res, next) => {
  res.locals.flashMessages = req.flash(); //-> stores flash messages as local var
  res.locals.loggedIn = req.isAuthenticated();
  res.locals.currentUser = req.user;
  next();
});


//Defining routes:
app.use("/", router);
router.get("/", homeController.showHomePage);

router.get("/users", usersController.index, usersController.indexView);
router.get("/users/new", usersController.new);
router.post("/users/create", usersController.validate, usersController.create, usersController.redirectView);
router.get("/users/login", usersController.login);
router.post("/users/login", usersController.authenticate);
router.get("/users/logout", usersController.logout, usersController.redirectView);
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