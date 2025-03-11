const express = require("express");
const usersController = require("./../controllers/usersController");
const router = express.Router();
const auth = require("./../Middlewares/auth");
const restrictTo = require("./../Middlewares/restrictTo");


router.post("/signup", usersController.signup);

router.post("/login", usersController.login);

router.get("/", auth, restrictTo("admin"), usersController.getUsers);

// router.post("/", usersController.createUser);

router.get("/:id", usersController.getUserById);

router.put("/:id", usersController.updateUserById);

router.delete("/:id", usersController.deleteUserById);

module.exports = router;
