const express = require("express");

const Router = express.Router();

const wishlistController = require("../controllers/wishlist");

Router.get("/:userId", wishlistController.getAllWishlist);
Router.delete("/:id", wishlistController.deleteWishlist);
Router.post("/", wishlistController.createWishlist);
Router.get("/:id", wishlistController.getWishlistById);
Router.patch("/:id", wishlistController.updateWishlist);

module.exports = Router;
