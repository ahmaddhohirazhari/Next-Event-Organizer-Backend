const express = require("express");

const Router = express.Router();

const eventController = require("../controllers/event");

const authMiddleware = require("../middleware/auth");
// eslint-disable-next-line import/no-unresolved
const uploadMiddleware = require("../middleware/uploadFile");

Router.get("/", eventController.getAllEvent);
Router.get("/:id", eventController.getEventById);
Router.post(
  "/",
  authMiddleware.authentication,
  authMiddleware.isAdmin,
  uploadMiddleware.uploadEvent,
  eventController.createEvent
);
Router.delete(
  "/:id",
  authMiddleware.authentication,
  authMiddleware.isAdmin,
  uploadMiddleware.uploadEvent,
  eventController.deleteEvent
);
Router.patch(
  "/:id",
  authMiddleware.authentication,
  authMiddleware.isAdmin,
  uploadMiddleware.uploadEvent,
  eventController.updateEvent
);

module.exports = Router;
