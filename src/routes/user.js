const express = require("express");

const Router = express.Router();

const userController = require("../controllers/user");

const authMiddleware = require("../middleware/auth");

const uploadMiddleware = require("../middleware/uploadFile");

// GET ALL DATA
Router.get(
  "/",
  authMiddleware.authentication,
  authMiddleware.isAdmin,
  userController.getAllUser
);

Router.get("/:id", authMiddleware.authentication, userController.getUserById);
Router.post("/", uploadMiddleware.uploadUser, userController.createUser);
Router.delete("/:id", authMiddleware.authentication, userController.deleteUser);

// UPDATE DATA USER
Router.patch(
  "/updateUser",
  authMiddleware.authentication,
  uploadMiddleware.uploadUser,
  userController.updateUser
);

// UPDATE IMAGE
Router.patch(
  "/updateImage",
  authMiddleware.authentication,
  uploadMiddleware.uploadUser,
  userController.updateImage
);

// UPDATE PASSWORD
Router.patch(
  "/updatePassword",
  authMiddleware.authentication,
  userController.updatePassword
);
module.exports = Router;
