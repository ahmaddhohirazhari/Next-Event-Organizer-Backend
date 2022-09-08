const express = require("express");

const Router = express.Router();

const wishlistController = require("../controllers/wishlist");

Router.get("/:userId", wishlistController.getAllWishlist);
Router.delete("/:id", wishlistController.deleteWishlist);
Router.post("/", wishlistController.createWishlist);
Router.get("/list/:id", wishlistController.getWishlistById);

module.exports = Router;
