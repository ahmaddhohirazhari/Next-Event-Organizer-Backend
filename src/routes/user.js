const express = require("express");

const Router = express.Router();

const userController = require("../controllers/user");

Router.get("/", userController.getAllUser);
Router.get("/:id", userController.getUserById);
Router.post("/", userController.createUser);
Router.delete("/:id", userController.deleteUser);
Router.patch("/:id", userController.updateUser);
module.exports = Router;
