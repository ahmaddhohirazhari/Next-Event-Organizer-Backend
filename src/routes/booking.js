const express = require("express");

const Router = express.Router();
const bookingController = require("../controllers/booking");

Router.post("/:userId", bookingController.createBooking);
Router.get("/:userId", bookingController.getAllBooking);
Router.get("/list/:userId", bookingController.getBookingByUserId);

module.exports = Router;
