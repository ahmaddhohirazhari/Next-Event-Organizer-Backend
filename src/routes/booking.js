const express = require("express");

const Router = express.Router();
const bookingController = require("../controllers/booking");
const authMiddleware = require("../middleware/auth");

Router.post(
  "/:userId",
  authMiddleware.authentication,
  bookingController.createBooking
);
Router.get(
  "/:userId",
  authMiddleware.authentication,
  bookingController.getAllBooking
);
Router.get(
  "/list/:id",
  authMiddleware.authentication,
  bookingController.getBookingByUserId
);
Router.get(
  "/bookingSection/:eventId",
  authMiddleware.authentication,
  bookingController.getBookingSection
);
Router.post("/midtrans-notification", bookingController.midtransNotification);

module.exports = Router;
