const express = require("express");

const Router = express.Router();

const eventController = require("../controllers/event");

const authMiddleware = require("../middleware/auth");
// eslint-disable-next-line import/no-unresolved
const uploadMiddleware = require("../middleware/uploadFile");

// const deleteMiddleware = require("../middleware/deleteFile");

// Router.get("/greetings", async (request, response) => {
// try {
//     response.status(200).send("Hello World!");
// } catch (error) {
//     console.log(error)
// }
// });

// Path Create
// Path Read
// Path Update
// Path Delete
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
  // deleteMiddleware.deleteEvent,
  eventController.deleteEvent
);
Router.patch("/:id", uploadMiddleware.uploadEvent, eventController.updateEvent);

module.exports = Router;
