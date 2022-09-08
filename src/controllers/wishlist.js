const wishlistModel = require("../models/wishlist");
const wrapper = require("../utils/wrapper");

module.exports = {
  createWishlist: async (request, response) => {
    try {
      const { eventId, userId } = request.body;
      const setWishlist = {
        eventId,
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
      let { page, limit } = request.query;
      const { userId } = request.params;
      page = +page;
      limit = +limit;

      const totalData = await wishlistModel.getCountWishlist();

      const totalPage = Math.ceil(totalData / limit);
      const pagination = {
        page,
        totalPage,
        limit,
        totalData,
      };

      const offset = page * limit - limit;

      const result = await wishlistModel.getAllWishlist(offset, limit, userId);
      return wrapper.response(
        response,
        result.status,
        "Success Get User !",
        result.data,
        pagination
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
  getWishlistById: async (request, response) => {
    try {
      const { id } = request.params;

      const result = await wishlistModel.getWishlistById(id);

      if (result.data.length < 1) {
        return wrapper.response(
          response,
          404,
          `Wishlist By wishlistId ${id} Not Found`,
          []
        );
      }

      return wrapper.response(
        response,
        result.status,
        "Success Get Wishlis By Id",
        result.data
      );
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorWishlist = null,
      } = error;
      return wrapper.response(response, status, statusText, errorWishlist);
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
