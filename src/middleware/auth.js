const jwt = require("jsonwebtoken");
const wrapper = require("../utils/wrapper");

module.exports = {
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
        console.log(result);
        // result = {
        //     userId: 'ca2973ed-9414-4135-84ac-799b6602d7b2',
        //     role: 'user',
        //     iat: 1662696652,
        //     exp: 1662783052
        //   }
        request.decodeToken = result;
        next();
      });
    } catch (error) {
      console.log(error);
    }
  },
  isAdmin: async (request, response, next) => {
    try {
      // PROSES UNTUK PENGECEKAN ROLE
      // console.log(request.decodeToken);
      next();
    } catch (error) {
      console.log(error);
    }
  },
};
