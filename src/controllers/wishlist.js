const { request } = require("express");
const wishlistModel = require("../models/wishlist");
const wrapper = require("../utils/wrapper");

module.exports = {
  createWishlist: async (request, response) => {
    try {
      const { WishlistId, userId } = request.body;
      const setWishlist = {
        WishlistId,
        userId,
      };
      const result = await wishlistModel.createWishlist(setWishlist);
      return wrapper.response(
        response,
        result.status,
        "Success Create Wishlist",
        result.data
      );
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },
  getAllWishlist: async (request, response) => {
    try {
      const result = await wishlistModel.getAllWishlist();
      return wrapper.response(
        response,
        result.status,
        "Success Get User !",
        result.data
      );
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },
  deleteWishlist: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await wishlistModel.deleteWishlist(id);
      return wrapper.response(
        response,
        result.status,
        "Success Delete Wishlist !",
        result.data
      );
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },
};
