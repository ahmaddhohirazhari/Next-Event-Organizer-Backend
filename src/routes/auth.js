const express = require("express");

const Router = express.Router();

const authController = require("../controllers/auth");

const uploadMiddleware = require("../middleware/uploadFIle");

Router.post("/register", uploadMiddleware.uploadUser, authController.register);
Router.post("/login", authController.login);

module.exports = Router;
