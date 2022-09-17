const express = require("express");

const Router = express.Router();

const wishlistController = require("../controllers/wishlist");
const authMiddleware = require("../middleware/auth");

Router.get(
  "/:userId",
  authMiddleware.authentication,
  wishlistController.getAllWishlist
);
Router.delete(
  "/:id",
  authMiddleware.authentication,
  wishlistController.deleteWishlist
);
Router.post(
  "/",
  authMiddleware.authentication,
  wishlistController.createWishlist
);
Router.get(
  "/list/:id",
  authMiddleware.authentication,
  wishlistController.getWishlistById
);

module.exports = Router;
