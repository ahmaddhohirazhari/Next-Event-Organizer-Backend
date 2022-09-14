const productModel = require("../models/product");
const wrapper = require("../utils/wrapper");
// const client = require("../config/redis");
const cloudinary = require("../config/cloudinary");

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
  getAllProduct: async (request, response) => {
    try {
      // console.log(request.query);
      let { page, limit, sort, searchDateCreated } = request.query;
      page = +page;
      limit = +limit;

      const totalData = await productModel.getCountProduct();
      const totalPage = Math.ceil(totalData / limit);
      const pagination = {
        // page, totalPage, limit, totalData
        page,
        totalPage,
        limit,
        totalData,
      };

      const offset = page * limit - limit;

      let sortColumn = "dateTimeShow";
      let sortType = "asc";
      if (sort) {
        sortColumn = sort.split(" ")[0];
        sortType = sort.split(" ")[1];
      }
      if (sortType.toLowerCase() === "asc") {
        sortType = true;
      } else {
        sortType = false;
      }

      let day;
      let nextDay;
      if (searchDateCreated) {
        day = new Date(searchDateCreated);
        nextDay = new Date(new Date(day).setDate(day.getDate() + 1));
      }

      const result = await productModel.getAllProduct(
        offset,
        limit,
        sortColumn,
        sortType,
        day,
        nextDay
      );

      client.setEx(
        `getProduct:${JSON.stringify(request.query)}`,
        3600,
        JSON.stringify({ result: result.data, pagination })
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
  getProductById: async (request, response) => {
    try {
      // const request = {
      //   // ...
      //   params: { id: "12345678" },
      //   // ...
      // };
      const { id } = request.params;

      const result = await productModel.getProductById(id);

      if (result.data.length < 1) {
        return wrapper.response(
          response,
          404,
          `Data By Id ${id} Not Found`,
          []
        );
      }

      client.setEx(`getProduct:${id}`, 3600, JSON.stringify(result.data));

      return wrapper.response(
        response,
        result.status,
        "Success Get Data By Id",
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
  createProduct: async (request, response) => {
    try {
      // console.log(request.file)
      // if (condition) {
      //   return wrapper.response(response, 400, "Image must be filled", null)
      // }
      const { name, price } = request.body;
      const { filename } = request.file;
      const setData = {
        name,
        price,
        image: filename || "",
      };

      const result = await productModel.createProduct(setData);

      return wrapper.response(
        response,
        result.status,
        "Success Create Data",
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
  updateProduct: async (request, response) => {
    try {
      // console.log(request.params);
      // console.log(request.body);
      const { id } = request.params;
      const { name, price } = request.body;

      const checkId = await productModel.getProductById(id);
      console.log(checkId);
      if (checkId.data.length < 1) {
        return wrapper.response(
          response,
          404,
          `Data By Id ${id} Not Found`,
          []
        );
      }

      const setData = {
        name,
        price,
        // updatedAt: ...
      };

      // bikin proses untuk ngecek apakah semua property di dalam setData ada isinya ?
      console.log(checkId.data[0].image);
      // cloudinary.uploader.destroy(
      //   "Event-Organizing/Product/rbrskppupgixjqiz6kqm",
      //   (result) => {
      //     console.log(result);
      //   }
      // );

      const result = await productModel.updateProduct(id, setData);

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
  deleteProduct: async (request, response) => {
    try {
      // 1. ngecek apakah idnya itu ada atau tidak ?
      // 1.a. jika tidak ada maka akan mengembalikan id tidak ada di database
      // 1.b. jika ada maka akan menjalankan proses delete
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
};

// request.query = bisa digunakan untuk fitur paginasi, sort,search di method get
// request.params = bisa digunakan untuk fitur getdatabyid, updatedata, deletedata
// request.body = bsa digunakan untuk fitur create/update
