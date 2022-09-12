const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const wrapper = require("../utils/wrapper");
const cloudinary = require("../config/cloudinary");

module.exports = {
  deleteEvent: async (request, rensponse, next) => {
    cloudinary.v2.uploader.destroy("sample", (error, result) => {
      console.log(result, error);
    });
  },
  deleteUser: (request, rensponse, next) => {},
};
