const userModel = require("../models/user");
const wrapper = require("../utils/wrapper");

module.exports = {
  getAllUser: async (request, response) => {
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
  getUserById: async (request, response) => {
    try {
      const { id } = request.params;

      const result = await userModel.getUserById(id);

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
        "Success Get User By Id",
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
  createUser: async (request, response) => {
    try {
      console.log(request.body);
      const {
        name,
        username,
        gender,
        profession,
        nationality,
        dateOfBirth,
        email,
        password,
        role,
      } = request.body;
      const { filename, mimetype } = request.file;
      const setUser = {
        name,
        username,
        gender,
        profession,
        nationality,
        dateOfBirth,
        email,
        password,
        role,
        image: filename ? `${filename}.${mimetype.split("/")[1]}` : "",
      };

      const result = await userModel.createUser(setUser);
      console.log(result);
      return wrapper.response(
        response,
        result.status,
        "Success Create User",
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
  updateUser: async (request, response) => {
    try {
      const { id } = request.params;
      const { name, username, gender, profession, nationality, dateOfBirth } =
        request.body;

      const checkId = await userModel.getUserById(id);

      if (checkId.data.length < 1) {
        return wrapper.response(
          response,
          404,
          `Update By Id ${id} Not Found`,
          []
        );
      }

      const setUser = {
        name,
        username,
        gender,
        profession,
        nationality,
        dateOfBirth,
      };

      const result = await userModel.updateUser(id, setUser);

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
  deleteUser: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await userModel.deleteUser(id);
      return wrapper.response(
        response,
        result.status,
        "Success Delete User !",
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
