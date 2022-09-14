const eventModel = require("../models/event");
const wrapper = require("../utils/wrapper");
const cloudinary = require("../config/cloudinary");

module.exports = {
  getAllEvent: async (request, response) => {
    try {
      // eslint-disable-next-line prefer-const
      let { page, limit, searchName, searchTimeShow, sort } = request.query;
      page = +page || 1;
      limit = +limit || 3;

      const totalData = await eventModel.getCountEvent();

      const totalPage = Math.ceil(totalData / limit);
      const pagination = {
        page,
        totalPage,
        limit,
        totalData,
      };

      const offset = page * limit - limit;

      // PROSES SET SORTING
      const setSort = (input) => {
        if (input.toLowerCase() === "dsc") {
          return false;
        }
        if (input.toLowerCase() === "asc") {
          return true;
        }
        return true;
      };
      const newSort = setSort(sort);

      // PROSES SEARCH SHOWTIME
      const day = new Date(searchTimeShow);
      const nextDay = new Date(new Date(day).setDate(day.getDate() + 1));

      const result = await eventModel.getAllEvent(
        offset,
        limit,
        searchName,
        newSort,
        day,
        nextDay
      );

      return wrapper.response(
        response,
        result.status,
        "Success Get Data !",
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
  getEventById: async (request, response) => {
    try {
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
      const { name, category, location, detail, dateTimeShow, price } =
        request.body;
      const { filename, mimetype } = request.file;
      const setEvent = {
        name,
        category,
        location,
        detail,
        dateTimeShow,
        price,
        image: filename ? `${filename}.${mimetype.split("/")[1]}` : "",
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
  deleteEvent: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await eventModel.deleteEvent(id);
      const { image } = result.data[0];
      const fileName = image.split(".")[0];

      // PROSES DELETE FILE DI CLOUDINARY
      await cloudinary.uploader.destroy(fileName, (res) => res);

      return wrapper.response(
        response,
        result.status,
        "Success Delete Event !",
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
  updateEvent: async (request, response) => {
    try {
      const { id } = request.params;
      const { name, category, location, detail, dateTimeShow, price } =
        request.body;
      const checkId = await eventModel.getEventById(id);
      if (checkId.data.length < 1) {
        return wrapper.response(
          response,
          404,
          `Update By Id ${id} Not Found`,
          []
        );
      }
      let image;
      if (request.file) {
        const { filename, mimetype } = request.file;
        image = filename ? `${filename}.${mimetype.split("/")[1]}` : "";

        // PROSES DELETE FILE DI CLOUDINARY
        await cloudinary.uploader.destroy(
          checkId.data[0].image.split(".")[0],
          (result) => result
        );
      }
      if (!request.file) {
        return wrapper.response(response, 404, "Image Must Be Filled");
      }

      const setData = {
        name,
        category,
        location,
        detail,
        dateTimeShow,
        price,
        image,
        updatedAt: "now()",
      };

      const result = await eventModel.updateEvent(id, setData);

      return wrapper.response(
        response,
        result.status,
        "Success Update Data",
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
