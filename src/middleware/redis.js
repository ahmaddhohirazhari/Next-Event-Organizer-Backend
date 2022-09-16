const client = require("../config/redis");
const wrapper = require("../utils/wrapper");

module.exports = {
  getEventById: async (request, response, next) => {
    try {
      const { id } = request.params;
      let result = await client.get(`getEvent:${id}`);
      if (result !== null) {
        // DATA ADA DIDALAM REDIS
        result = JSON.parse(result);
        return wrapper.response(
          response,
          200,
          "Success Get Data By Id",
          result
        );
      }
      // JIKA DATA TIDAK ADA DI DALAM REDIS
      return next();
    } catch (error) {
      return wrapper.response(response, 400, error.message, null);
    }
  },
  getAllEvent: async (request, response, next) => {
    try {
      let result = await client.get(
        `getEvent:${JSON.stringify(request.query)}`
      );
      if (result !== null) {
        result = JSON.parse(result);
        return wrapper.response(
          response,
          200,
          "Success Get Data !",
          result.result,
          result.pagination
        );
      }
      return next();
    } catch (error) {
      return wrapper.response(response, 400, error.message, null);
    }
  },
  clearEvent: async (request, response, next) => {
    try {
      const keys = await client.keys("getEvent:*");
      if (keys.length > 0) {
        keys.forEach(async (element) => {
          await client.del(element);
        });
      }
      return next();
    } catch (error) {
      return wrapper.response(response, 400, error.message, null);
    }
  },
};
