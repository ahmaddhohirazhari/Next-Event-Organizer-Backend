const express = require("express");

const Router = express.Router();
const eventController = require("../controllers/event");

const authMiddleware = require("../middleware/auth");

const uploadMiddleware = require("../middleware/uploadFile");
const redisMiddleware = require("../middleware/redis");

Router.get(
  "/",
  // redisMiddleware.getAllEvent,
  eventController.getAllEvent
);
Router.get(
  "/:id",
  // authMiddleware.authentication,
  redisMiddleware.getEventById,
  eventController.getEventById
);
Router.post(
  "/",
  authMiddleware.authentication,
  authMiddleware.isAdmin,
  uploadMiddleware.uploadEvent,
  redisMiddleware.clearEvent,
  eventController.createEvent
);
Router.delete(
  "/:id",
  authMiddleware.authentication,
  authMiddleware.isAdmin,
  uploadMiddleware.uploadEvent,
  redisMiddleware.clearEvent,
  eventController.deleteEvent
);
Router.patch(
  "/:id",
  authMiddleware.authentication,
  authMiddleware.isAdmin,
  uploadMiddleware.uploadEvent,
  redisMiddleware.clearEvent,
  eventController.updateEvent
);

module.exports = Router;
