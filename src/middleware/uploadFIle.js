const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const wrapper = require("../utils/wrapper");
const cloudinary = require("../config/cloudinary");

module.exports = {
  uploadEvent: (request, response, next) => {
    const storage = new CloudinaryStorage({
      cloudinary,
      params: {
        folder: "Next-Event-Organizer/Event",
      },
    });
    const upload = multer({
      // MULTER SETTING
      storage,
      // FILTERING TYPE AND SIZE FILE
      fileFilter(req, file, callback) {
        const ext = file.mimetype.split("/")[1];
        if (ext !== "png" && ext !== "jpg" && ext !== "gif" && ext !== "jpeg") {
          return callback(new Error("Only images are allowed"));
        }
        return callback(null, true);
      },
      limits: {
        fileSize: 500 * 1024,
      },
    }).single("image");

    upload(request, response, (err) => {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        return wrapper.response(response, 401, err.message, null);
      }
      if (err) {
        // An unknown error occurred when uploading.
        return wrapper.response(response, 401, err.message, null);
      }
      // Everything went fine.
      return next();
    });
  },
  uploadUser: (request, response, next) => {
    const storage = new CloudinaryStorage({
      cloudinary,
      params: {
        folder: "Next-Event-Organizer/User",
      },
    });
    const upload = multer({
      // MULTER SETTING
      storage,
      // FILTERING TYPE AND SIZE FILE
      fileFilter(_req, file, callback) {
        const ext = file.mimetype.split("/")[1];
        if (ext !== "png" && ext !== "jpg" && ext !== "gif" && ext !== "jpeg") {
          return callback(new Error("Only images are allowed"));
        }
        return callback(null, true);
      },
      limits: {
        fileSize: 500 * 1024,
      },
    }).single("image");

    upload(request, response, (err) => {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        return wrapper.response(response, 401, err.message, null);
      }
      if (err) {
        // An unknown error occurred when uploading.
        return wrapper.response(response, 401, err.message, null);
      }

      // Everything went fine.
      return next();
    });
  },
};
