const bcrypt = require("bcrypt");
const userModel = require("../models/user");
const wrapper = require("../utils/wrapper");
const cloudinary = require("../config/cloudinary");

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
      const {
        name,
        username,
        gender,
        profession,
        nationality,
        dateOfBirth,
        phoneNumber,
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
        phoneNumber,
        email,
        password,
        role,
        image: filename ? `${filename}.${mimetype.split("/")[1]}` : "",
      };

      const result = await userModel.createUser(setUser);
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
      const { userId } = request.decodeToken;

      const {
        name,
        username,
        gender,
        profession,
        nationality,
        dateOfBirth,
        phoneNumber,
        role,
      } = request.body;
      const checkId = await userModel.getUserById(userId);
      if (checkId.data.length < 1) {
        return wrapper.response(
          response,
          404,
          `Update By Id ${userId} Not Found`,
          []
        );
      }
      let image;
      if (request.file) {
        const { filename, mimetype } = request.file;
        image = filename ? `${filename}.${mimetype.split("/")[1]}` : "";
        // PROSES DELETE FILE DI CLOUDINARY
        cloudinary.uploader.destroy(image, (result) => result);
      }
      let status;
      const setData = {
        name,
        username,
        gender,
        profession,
        nationality,
        dateOfBirth,
        phoneNumber,
        role,
        image,
        status,
      };

      const result = await userModel.updateUser(userId, setData);

      return wrapper.response(
        response,
        result.status,
        "Success Update Data",
        result.data
      );
    } catch (error) {
      console.log(error);
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
      const checkId = await userModel.getUserById(id);
      if (checkId.data.length < 1) {
        return wrapper.response(
          response,
          404,
          `Update By Id ${id} Not Found`,
          []
        );
      }
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
  updateImage: async (request, response) => {
    try {
      const { userId } = request.decodeToken;
      const checkId = await userModel.getUserById(userId);
      if (checkId.data.length < 1) {
        return wrapper.response(
          response,
          404,
          `Update By Id ${userId} Not Found`,
          []
        );
      }

      let image;
      if (request.file) {
        const { filename, mimetype } = request.file;
        image = filename ? `${filename}.${mimetype.split("/")[1]}` : "";

        // PROSES DELETE FILE DI CLOUDINARY
        if (checkId.data[0].image) {
          cloudinary.uploader.destroy(
            checkId.data[0].image.split(".")[0],
            (result) => result
          );
        }
      }
      if (!request.file) {
        return wrapper.response(response, 404, "Image Must Be Filled");
      }

      const setData = {
        image,
      };
      const result = await userModel.updateUser(userId, setData);
      const newResult = [
        {
          userId: result.data[0].userId,
          image: result.data[0].image,
          createdAt: result.data[0].createdAt,
          updatedAt: result.data[0].updatedAt,
        },
      ];
      return wrapper.response(
        response,
        result.status,
        "Success Update Image",
        newResult
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
  updatePassword: async (request, response) => {
    try {
      const { userId } = request.decodeToken;

      const { oldPassword, newPassword, confirmPassword } = request.body;
      const checkId = await userModel.getUserById(userId);
      if (checkId.data.length < 1) {
        return wrapper.response(
          response,
          404,
          `Update By Id ${userId} Not Found`,
          []
        );
      }

      // VALIDASI OLDPASSWORD
      const isValid = await bcrypt
        .compare(oldPassword, checkId.data[0].password)
        .then((result) => result);
      if (!isValid) {
        return wrapper.response(response, 400, "Wrong Password", null);
      }

      // CONFIRM NEWPASSWORD
      if (newPassword !== confirmPassword) {
        return wrapper.response(response, 400, "Password Not Match", null);
      }

      // HASH PASSWORD
      const hash = bcrypt.hashSync(newPassword, 10);
      const setData = {
        password: hash,
        updatedAt: "now()",
      };

      const result = await userModel.updateUser(userId, setData);

      const newResult = [
        {
          userId: result.data[0].userId,
          createdAt: result.data[0].createdAt,
          updatedAt: result.data[0].updatedAt,
        },
      ];

      return wrapper.response(
        response,
        result.status,
        "Success Update Password",
        newResult
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
