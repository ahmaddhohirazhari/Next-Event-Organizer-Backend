const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_DATABSE_NAME,
  api_key: process.env.CLOUDINARY_DATABSE_API_KEY,
  api_secret: process.env.CLOUDINARY_DATABSE_API_SECRET,
  secure: true,
});

module.exports = cloudinary;
