const express = require("express");

const Router = express.Router();
const bookingController = require("../controllers/booking");

Router.post("/", bookingController.createBooking);
Router.get("/", bookingController.getAllBooking);
Router.get("/:id", bookingController.getBookingByUserId);
// Router.update("/:id", bookingController.updateBooking);
// Router.delete("/{id", bookingController.deleteBooking);

module.exports = Router;
