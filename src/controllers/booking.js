/* eslint-disable no-unused-vars */
const bookingModel = require("../models/booking");
const wrapper = require("../utils/wrapper");
const groupingSection = require("../utils/groupingSection");
const client = require("../config/redis");
const snapMidtrans = require("../utils/midtrans");

module.exports = {
  createBooking: async (request, response) => {
    try {
      const { eventId, totalPayment, paymentMethod, statusPayment, section } =
        request.body;

      const { userId } = request.decodeToken;
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
      const parameterBooking = {
        bookingId,
        totalPayment,
      };
      const resultMidtrans = await snapMidtrans.post(parameterBooking);
      return wrapper.response(
        response,
        result.status,
        "Succes Create Booking",
        {
          bookingId,
          ...finalResult,
          redirectUrl: resultMidtrans.redirect_url,
        }
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
      const { userId } = request.decodeToken;

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
          `Booking Section By Event Id ${eventId} Not Found`,
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
  midtransNotification: async (request, response) => {
    try {
      const result = await snapMidtrans.notif(request.body);

      const bookingId = result.order_id;
      const transactionStatus = result.transaction_status;
      const fraudStatus = result.fraud_status;

      if (transactionStatus === "capture") {
        // capture only applies to card transaction, which you need to check for the fraudStatus
        if (fraudStatus === "challenge") {
          // TODO set transaction status on your databaase to 'challenge'
          const setData = {
            paymentMethod: result.payment_type,
            statusPayment: "challenge",
            // updatedAt: ...
          };
          // jalankan proses model untuk mengupdate data (setData) dan untuk bookingId didapat dari order_id diatas
        } else if (fraudStatus === "accept") {
          // TODO set transaction status on your databaase to 'success'
          const setData = {
            paymentMethod: result.payment_type,
            statusPayment: "success",
            // updatedAt: ...
          };
          // jalankan proses model untuk mengupdate data (setData) dan untuk bookingId didapat dari order_id diatas
        }
      } else if (transactionStatus === "settlement") {
        // TODO set transaction status on your databaase to 'success'
        const setData = {
          paymentMethod: result.payment_type,
          statusPayment: "success",
          // updatedAt: ...
        };
        // jalankan proses model untuk mengupdate data (setData) dan untuk bookingId didapat dari order_id diatas
      } else if (transactionStatus === "deny") {
        // TODO you can ignore 'deny', because most of the time it allows payment retries
        // and later can become success
        const setData = {
          paymentMethod: result.payment_type,
          statusPayment: "failed",
          // updatedAt: ...
        };
        // jalankan proses model untuk mengupdate data (setData) dan untuk bookingId didapat dari order_id diatas
      } else if (
        transactionStatus === "cancel" ||
        transactionStatus === "expire"
      ) {
        // TODO set transaction status on your databaase to 'failure'
        const setData = {
          paymentMethod: result.payment_type,
          statusPayment: "failed",
          // updatedAt: ...
        };
        // jalankan proses model untuk mengupdate data (setData) dan untuk bookingId didapat dari order_id diatas
      } else if (transactionStatus === "pending") {
        // TODO set transaction status on your databaase to 'pending' / waiting payment
        const setData = {
          paymentMethod: result.payment_type,
          statusPayment: "pending",
          // updatedAt: ...
        };
        // jalankan proses model untuk mengupdate data (setData) dan untuk bookingId didapat dari order_id diatas
      }

      return wrapper.response(response, 200, "Success Update Status Booking", {
        bookingId,
        statusPayment: transactionStatus,
      });
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
