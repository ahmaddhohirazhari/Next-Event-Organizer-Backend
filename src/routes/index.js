const express = require("express");

const Router = express.Router();

const eventRoutes = require("./event");
const userRoutes = require("./user");
const wishlistRoutes = require("./wishlist");
const bookingRoutes = require("./booking");
const authRoutes = require("./auth");

Router.use("/event", eventRoutes);
Router.use("/user", userRoutes);
Router.use("/wishlist", wishlistRoutes);
Router.use("/booking", bookingRoutes);
Router.use("/auth", authRoutes);

module.exports = Router;
