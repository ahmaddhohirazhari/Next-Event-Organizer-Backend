const { request } = require("express");
const eventModel = require("../models/event");
const wrapper = require("../utils/wrapper");

module.exports = {
  showGreetings: async (request, response) => {
    try {
      // return response.status(200).send("Hello World!");
      return wrapper.response(
        response,
        200,
        "Success Get Greetings",
        "Hello World !"
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
  getAllEvent: async (request, response) => {
    try {
      console.log(request.query);
      const result = await eventModel.getAllEvent();
      return wrapper.response(
        response,
        result.status,
        "Success Get Event !",
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
  getEventById: async (request, response) => {
    try {
      // const request = {
      //   // ...
      //   params: { id: "12345678" },
      //   // ...
      // };
      const { id } = request.params;

      const result = await eventModel.getEventById(id);

      if (result.data.length < 1) {
        return wrapper.response(
          response,
          404,
          `Event By eventId ${id} Not Found`,
          []
        );
      }

      return wrapper.response(
        response,
        result.status,
        "Success Get Event By Id",
        result.data
      );
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorEvent = null,
      } = error;
      return wrapper.response(response, status, statusText, errorEvent);
    }
  },
  createEvent: async (request, response) => {
    try {
      console.log(request.body);
      const { name, category, location, detail, dateTimeShow, price } =
        request.body;
      const setEvent = {
        name,
        category,
        location,
        detail,
        dateTimeShow,
        price,
      };

      const result = await eventModel.createEvent(setEvent);

      return wrapper.response(
        response,
        result.status,
        "Success Create Event",
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

// request.query = bisa digunakan untuk fitur paginasi, sort,search di method get
// request.params = bisa digunakan untuk fitur getdatabyid, updatedata, deletedata
// request.body = bsa digunakan untuk fitur create/update
