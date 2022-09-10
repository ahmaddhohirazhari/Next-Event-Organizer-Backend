const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dhohircloud",
  api_key: "259886355277397",
  api_secret: "KCnW5OfaEX8_3oNu3k6YVW7cpDg",
  secure: true,
});

module.exports = cloudinary;
