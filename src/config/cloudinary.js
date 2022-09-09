const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dd1uwz8eu",
  api_key: "864428855492574",
  api_secret: "WXzxghgj_s5J-qFgwwYiddEfXJU",
  secure: true,
});

module.exports = cloudinary;
