const course = require("../models/course");

const router = require("express").Router(),
    coursesController = require("../controllers/coursesController"),
    usersControler = require("../controllers/usersController");

/* inside the app routes that do not use JWT */
router.get("/courses/no-jwt", coursesController.index, coursesController.filterUserCourses, coursesController.respondJSON);
router.get("/courses/no-jwt/:id/join", coursesController.join, coursesController.respondJSON);

router.post("/login", usersControler.apiAuthenticate);
router.use(usersControler.verifyJWT);
router.get("/courses", coursesController.index, coursesController.filterUserCourses, coursesController.respondJSON);
router.use(coursesController.errorJSON);

module.exports = router;