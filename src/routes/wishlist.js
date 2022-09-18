const express = require("express");

const Router = express.Router();

const wishlistController = require("../controllers/wishlist");
const authMiddleware = require("../middleware/auth");
const redisMiddleware = require("../middleware/redis");

Router.get(
  "/:userId",
  authMiddleware.authentication,
  redisMiddleware.getAllWishlist,
  wishlistController.getAllWishlist
);
Router.get(
  "/list/:id",
  authMiddleware.authentication,
  redisMiddleware.getWishlistById,
  wishlistController.getWishlistById
);
Router.post(
  "/",
  redisMiddleware.clearWishlist,
  authMiddleware.authentication,
  wishlistController.createWishlist
);

Router.delete(
  "/:id",
  authMiddleware.authentication,
  redisMiddleware.clearEvent,
  wishlistController.deleteWishlist
);

module.exports = Router;
