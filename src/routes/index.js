const express = require("express");

const Router = express.Router();

Router.get("/greetings", (request, response) => {
  response.status(200).send("Hello World!");
});

module.exports = Router;
