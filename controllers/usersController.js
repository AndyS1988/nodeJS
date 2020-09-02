"use strict";

const User = require("../models/user"),
  getUserParams = body => {
    return {
      name: {
        first: body.first,
        last: body.last
      },
      email: body.email,
      password: body.password,
      zipCode: body.zipCode
    };
  };

module.exports = {
    index: (req, res, next) => {
        User.find({})
            .exec()
            .then(users => {
                res.locals.users = users;
                next();
            })
            .catch(error => {
                console.log(`Error fetching users: ${error.message}`);
                next(error);
            })
    },
    indexView: (req, res) => {
        res.render("users/index", {
          flashMessages: {
            success: "Loaded all users"
          }
        });
    },
    new: (req, res) => {
        res.render("users/new")
    },
    create: (req, res, next) => {
        let userParams = getUserParams(req.body);
        User.create(userParams)
            .then(user => {
                req.flash("success", `${user.fullName}'s account was created successfully`);
                res.locals.redirect = "/users";
                res.locals.user = user;
                next()
            })
            .catch(error => {
                console.log(`Error saving user: ${error.message}`);
                res.locals.redirect = "/users/new";
                req.flash("error", `Failed to create a new user account due to ${error.message}.`);
                next();
            })
    },
    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath) res.redirect(redirectPath)
        else next();
    },
    show: (req, res, next) => {
        let userID = req.params.id;
        User.findById(userID)
            .then(user => {
                res.locals.user = user;
                next();
            })
            .catch(error => {
                console.log(`Error fetching user by ID: ${error.message}`);
                next(error);
            });
    },
    showView: (req, res) => {
        res.render("users/show");
    },
    edit: (req, res, next) => {
        let userId = req.params.id;
        User.findById(userId)
          .then(user => {
            res.render("users/edit", {
              user: user
            });
          })
          .catch(error => {
            console.log(`Error fetching user by ID: ${error.message}`);
            next(error);
          });
      },
      update: (req, res, next) => {
        let userId = req.params.id,
          userParams = {
            name: {
              first: req.body.first,
              last: req.body.last
            },
            email: req.body.email,
            password: req.body.password,
            zipCode: req.body.zipCode
          };
        User.findByIdAndUpdate(userId, {
          $set: userParams
        })
          .then(user => {
            req.flash("success", `${user.fullName}'s account was updated.`);
            res.locals.redirect = `/users/${userId}`;
            res.locals.user = user;
            next();
          })
          .catch(error => {
            console.log(`Error updating user by ID: ${error.message}`);
            req.flash("error", `Failed to update user account due to ${error.message}.`);
            next(error);
          });
      },
      delete: (req, res, next) => {
        let userId = req.params.id;
        User.findByIdAndRemove(userId)
          .then(() => {
            req.flash("success", `Account was deleted.`);
            res.locals.redirect = "/users";
            next();
          })
          .catch(error => {
            console.log(`Error deleting user by ID: ${error.message}`);
            req.flash("error", `Failed to delete user account due to ${error.message}.`);
            next();
          });
      },
      login: (req, res) => {
        res.render("users/login")
      },
      authenticate: (req, res, next) => {
        User.findOne({
          email: req.body.email
        })
        .then(user => {
        if (user) {
          user.passwordComparison(req.body.password).then(passwordsMatch => {
            if (passwordsMatch) {
              res.locals.redirect = `/users/${user._id}`;
              req.flash("success", `${user.fullName}'s logged in successfully!`);
              res.locals.user = user;
            } else {
              req.flash("error", "Failed to log in user account: Incorrect Password.");
              res.locals.redirect = "/users/login";
            }
            next();
          });
        } else {
          req.flash("error", "Failed to log in user account: User account not found.");
          res.locals.redirect = "/users/login";
          next();
        }
      })
      .catch(error => {
        console.log(`Error logging in user: ${error.message}`);
        next(error);
      });
  }
  //Breaking changes were introduced in 6.0.0 router.use(expressValidator()) throwing error -> either downgrade version on do no use
  /*validate: (req, res, next) => {
    req
      .sanitizeBody("email")
      .normalizeEmail({
        all_lowercase: true
      })
      .trim();
    req.check("email", "Email is invalid").isEmail();
    req.check("zipCode", "Zip code is invalid")
      .notEmpty()
      .isInt()
      .isLength({
        min: 5,
        max: 5
      })
      .equals(req.body.zipCode);
    req.check("password", "Password cannot be empty").notEmpty();

    req.getValidationResult().then(error => {
      if (!error.isEmpty()) {
        let messages = error.array().map(e => e.msg);
        req.skip = true;
        req.flash("error", messages.join(" and "));
        res.locals.redirect = "/users/new";
        next();
      } else {
        next();
      }
    });
  }*/
};