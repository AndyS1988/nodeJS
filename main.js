"use strict";

const express = require("express"),
  app = express(),
  router = require("./routes/index"),
  layouts = require("express-ejs-layouts"),
  methodOverride = require("method-override"),
  mongoose = require("mongoose"),
  expressSession = require("express-session"),
  cookieParser = require("cookie-parser"),
  connectFlash = require("connect-flash"),
  expressValidator = require("express-validator"),
  passport = require("passport"),
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

app.use(
  methodOverride("_method", {
    methods: ["POST", "GET"]
  })
);

app.use(express.json());
app.use(cookieParser(process.env.PASSWORD)); //using environmetnal var -> nano .bash_profile to create a new password var, printenv to view the environment
app.use(expressSession({
  secret: process.env.PASSWORD,
  cookie: {
    maxAge: 4000000
  },
  resave: false,
  saveUninitialized: false
}));

app.use(connectFlash()); //-> allows to call flesh on any req
app.use(expressValidator());
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.flashMessages = req.flash(); //-> stores flash messages as local var
  res.locals.loggedIn = req.isAuthenticated();
  res.locals.currentUser = req.user;
  next();
});

app.use("/", router);

app.listen(app.get("port"), () => {
    console.log(`Server running at http://localhost:${app.get("port")}`);
});