const express = require("express");

const Router = express.Router();

const eventController = require("../controllers/event");

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
Router.post("/", eventController.createEvent);
Router.delete("/:id", eventController.deleteEvent);

module.exports = Router;
