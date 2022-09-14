/* eslint-disable prefer-destructuring */
const jwt = require("jsonwebtoken");
const wrapper = require("../utils/wrapper");

module.exports = {
  // eslint-disable-next-line consistent-return
  authentication: async (request, response, next) => {
    try {
      let token = request.headers.authorization;

      if (!token) {
        return wrapper.response(response, 403, "Please Login First", null);
      }

      token = token.split(" ")[1];

      jwt.verify(token, "RAHASIA", (error, result) => {
        if (error) {
          return wrapper.response(response, 403, error.message, null);
        }
        // result = {
        //     userId: 'ca2973ed-9414-4135-84ac-799b6602d7b2',
        //     role: 'user',
        //     iat: 1662696652,
        //     exp: 1662783052
        //   }
        request.decodeToken = result;
        return next();
      });
    } catch (error) {
      return error.error;
    }
  },
  // eslint-disable-next-line consistent-return
  isAdmin: async (request, response, next) => {
    try {
      // PROSES UNTUK PENGECEKAN ROLE
      let token = request.headers.authorization;
      // eslint-disable-next-line prefer-destructuring
      token = token.split(" ")[1];

      jwt.verify(token, "RAHASIA", (error, result) => {
        if (result.role === "user") {
          return wrapper.response(response, 403, "You Not Admin", null);
        }
        return next();
      });

      // console.log(request.decodeToken);
    } catch (error) {
      return error.error;
    }
  },
};
