const bookingModel = require("../models/booking");
const wrapper = require("../utils/wrapper");

module.exports = {
  createBooking: async (request, response) => {
    try {
      const {
        userId,
        eventId,
        totalTicket,
        totalPayment,
        paymentMethod,
        statusPayment,
      } = request.body;
      const setBooking = {
        userId,
        eventId,
        totalTicket,
        totalPayment,
        paymentMethod,
        statusPayment,
      };
      const result = await bookingModel.createBooking(setBooking);

      return wrapper.response(
        response,
        result.status,
        "Succes Create Booking",
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
  getAllBooking: async (request, response) => {
    try {
      const result = await bookingModel.getAllBooking();
      return wrapper.response(
        response,
        result.status,
        "Success Get Data Booking !",
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
  getBookingByUserId: async (request, response) => {
    try {
      const { id } = request.params;

      const result = await bookingModel.getBookingByUserId(id);

      if (result.data.length < 1) {
        return wrapper.response(
          response,
          404,
          `User By user Id ${id} Not Found`,
          []
        );
      }

      return wrapper.response(
        response,
        result.status,
        "Success Get Booking By UserId",
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
