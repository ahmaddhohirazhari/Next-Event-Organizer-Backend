const express = require("express");

const Router = express.Router();

const wishlistController = require("../controllers/wishlist");

Router.get("/", wishlistController.getAllWishlist);
Router.delete("/:id", wishlistController.deleteWishlist);
Router.post("/", wishlistController.createWishlist);
Router.get("/:id", wishlistController.getWishlistById);

module.exports = Router;
