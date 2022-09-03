const { request } = require("express");
const wishlistModel = require("../models/wishlist");
const wrapper = require("../utils/wrapper");

module.exports = {
  createWishlist: async (request, response) => {
    try {
      const result = await wishlistModel.createWishlist();
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
      const result = await userModel.getAllUser();
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
};
