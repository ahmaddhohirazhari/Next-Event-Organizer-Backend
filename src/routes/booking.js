const express = require("express");

const Router = express.Router();
const bookingController = require("../controllers/booking");
const authMiddleware = require("../middleware/auth");

Router.post(
  "/:userId",
  authMiddleware.authentication,
  bookingController.createBooking
);
Router.get("/:userId", bookingController.getAllBooking);
Router.get("/list/:userId", bookingController.getBookingByUserId);
Router.get(
  "/bookingSection/:eventId",
  authMiddleware.authentication,
  bookingController.getBookingSection
);

module.exports = Router;
