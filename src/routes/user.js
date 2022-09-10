const express = require("express");

const Router = express.Router();

const userController = require("../controllers/user");

const authMiddleware = require("../middleware/auth");
const uploadMiddleware = require("../middleware/uploadFile");

Router.get(
  "/",
  authMiddleware.authentication,
  authMiddleware.isAdmin,
  userController.getUserById
);
Router.get("/", userController.getAllUser);
Router.get("/:id", userController.getUserById);
Router.post("/", uploadMiddleware.uploadUser, userController.createUser);
Router.delete("/:id", userController.deleteUser);
Router.patch("/:id", userController.updateUser);
module.exports = Router;
