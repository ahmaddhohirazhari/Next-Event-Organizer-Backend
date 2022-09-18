const bookingModel = require("../models/booking");
const wrapper = require("../utils/wrapper");
const groupingSection = require("../utils/groupingSection");
const client = require("../config/redis");

module.exports = {
  createBooking: async (request, response) => {
    try {
      const { eventId, totalPayment, paymentMethod, statusPayment, section } =
        request.body;

      const { userId } = request.params;
      const totalTicket = section.length;

      const setBooking = {
        userId,
        eventId,
        totalTicket,
        totalPayment,
        paymentMethod,
        statusPayment,
      };
      const result = await bookingModel.createBooking(setBooking);
      const { bookingId } = result.data[0];

      const resultBookingSection = await Promise.all(
        section.map(async (e) => {
          try {
            await bookingModel.createBookingSection(bookingId, e, false);
            return e;
          } catch (error) {
            return error.error;
          }
        })
      );
      const finalResult = { ...result.data[0], section: resultBookingSection };

      return wrapper.response(
        response,
        result.status,
        "Succes Create Booking",
        finalResult
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
      let { page, limit } = request.query;
      const { userId } = request.params;
      page = +page || 1;
      limit = +limit || 5;

      const totalData = await bookingModel.getCountBooking();
      const totalPage = Math.ceil(totalData / limit);
      const pagination = {
        page,
        totalPage,
        limit,
        totalData,
      };

      const offset = page * limit - limit;

      const result = await bookingModel.getAllBooking(offset, limit, userId);

      client.setEx(
        `getBooking:${JSON.stringify(request.query)}`,
        3600,
        JSON.stringify({ result: result.data, pagination })
      );

      return wrapper.response(
        response,
        result.status,
        "Success Get Data Booking !",
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
  getBookingByUserId: async (request, response) => {
    try {
      const { userId } = request.params;

      const result = await bookingModel.getBookingByUserId(userId);
      if (result.data.length < 1) {
        return wrapper.response(
          response,
          404,
          `User By user Id ${userId} Not Found`,
          []
        );
      }
      client.setEx(`getBooking:${userId}`, 3600, JSON.stringify(result.data));
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
  getBookingSection: async (request, response) => {
    try {
      const { eventId } = request.params;
      const result = await bookingModel.getBookingSection(eventId);
      if (result.data.length < 1) {
        return wrapper.response(
          response,
          404,
          `User By user Id ${eventId} Not Found`,
          []
        );
      }
      client.setEx(`getBooking:${eventId}`, 3600, JSON.stringify(result.data));
      const resultSection = groupingSection(result);

      return wrapper.response(
        response,
        result.status,
        "Success Get Booking Section",
        resultSection
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
