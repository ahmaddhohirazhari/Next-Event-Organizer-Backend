const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const otpGenerator = require("otp-generator");
const authModel = require("../models/auth");
const wrapper = require("../utils/wrapper");
const client = require("../config/redis");
const { sendMail } = require("../utils/mail");

module.exports = {
  register: async (request, response) => {
    try {
      const { username, email, password } = request.body;

      // PROSES VALIDASI PASSWORD
      if (password.length < 6) {
        return wrapper.response(
          response,
          400,
          "At Least 6 Character Password",
          null
        );
      }

      // PROSES ENCRYPT PASSWORD
      const hash = bcrypt.hashSync(password, 10);

      const setData = {
        username,
        email,
        password: hash,
      };

      // PROSES PENGECEKAN APAKAH EMAIL YANG MAU DI DAFTARKAN SUDAH ADA ATAU BELUM ?
      const checkEmail = await authModel.getUserByEmail(email);
      if (checkEmail.data.length > 0) {
        return wrapper.response(response, 403, "Email Alredy Registered", null);
      }

      // PROSES MENYIMPAN DATA KE DATABASE LEWAT MODEL
      const result = await authModel.register(setData);
      const newResult = [{ userId: result.data[0].userId }];

      // GENERATE OTP
      const OTP = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
      });
      client.setEx(`OTP:${OTP}`, 3600, OTP);
      client.setEx(`userId:${OTP}`, 3600 * 48, result.data[0].userId);
      // SEND EMAIL ACTIVATION
      const setMailOptions = {
        to: email,
        name: username,
        subject: "Email Verification !",
        template: "verificationEmail.html",
        buttonUrl: `http://localhost:3001/api/auth/verify/${OTP}`,
        OTP,
      };

      await sendMail(setMailOptions);

      return wrapper.response(
        response,
        200,
        "Success Register Please Check Your Email",
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
  verify: async (request, response) => {
    try {
      const { OTP } = request.params;

      const cehckOTP = await client.get(`OTP:${OTP}`);
      if (!cehckOTP) {
        return wrapper.response(response, 400, "Wrong Input OTP", null);
      }
      const userId = await client.get(`userId:${OTP}`);
      const result = [{ userId }];
      client.set(`userId: ${result[0].userId}`);
      return wrapper.response(response, 200, "Verify Success ", result);
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },
  login: async (request, response) => {
    try {
      const { email, password } = request.body;

      // 1. PROSES PENGECEKAN EMAIL
      const checkEmail = await authModel.getUserByEmail(email);
      if (checkEmail.data.length < 1) {
        return wrapper.response(response, 404, "Email Not Registed", null);
      }

      // 2. PROSES PENCOCOKAN PASSWORD
      const isValid = await bcrypt
        .compare(password, checkEmail.data[0].password)
        .then((result) => result);
      if (!isValid) {
        return wrapper.response(response, 400, "Wrong Password", null);
      }

      // CEK STATUS ACOUNT
      const cehckStatus = await client.get(
        `userId:${checkEmail.data[0].password}`
      );
      if (!cehckStatus) {
        return wrapper.response(
          response,
          400,
          "Please Activate Your Account",
          null
        );
      }

      // 3. PROSES PEMBUATAN TOKEN JWT
      // PAYLOAD = DATA YANG MAU DISIMPAN/DIJADIKAN TOKEN
      // KEY = KATA KUNCI BISA DI GENERATE ATAU DIBUAT LANGSUNG
      // const payload = checkEmail.data[0];
      // delete payload.password;

      const payload = {
        userId: checkEmail.data[0].userId,
        role: !checkEmail.data[0].role ? "user" : checkEmail.data[0].role,
      };

      const token = jwt.sign(payload, process.env.ACCESS_KEYS, {
        expiresIn: "24h",
      });

      const refreshToken = jwt.sign(payload, process.env.REFRESH_KEYS, {
        expiresIn: "36h",
      });

      // 4. PROSES RESPON KE USER
      const setStatus = {
        status: "active",
      };
      const result = await authModel.register(setStatus);
      const newResult = {
        userId: result.data[0].status,
        token,
        refreshToken,
      };
      return wrapper.response(response, 200, "Success Login", newResult);
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },
  logout: async (request, response) => {
    try {
      let token = request.headers.authorization;
      const { refreshtoken } = request.headers;
      [token] = [token.split(" ")[1]];

      client.setEx(`accessToken:${token}`, 3600 * 48, token);
      client.setEx(`refreshoken:${refreshtoken}`, 3600 * 48, refreshtoken);

      return wrapper.response(response, 200, "Success Logout", null);
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },
  refresh: async (request, response) => {
    try {
      const { refreshtoken } = request.headers;
      if (!refreshtoken) {
        return wrapper.response(
          response,
          400,
          "Request Token Must Be Filled",
          null
        );
      }

      const checkTokenBlacklist = await client.get(
        `refreshtoken:${refreshtoken}`
      );

      if (checkTokenBlacklist) {
        return wrapper.response(
          response,
          403,
          "Your Token is Destroyed Pleease Login Again",
          null
        );
      }

      let payload;
      let token;
      let newRefreshtoken;

      jwt.verify(refreshtoken, process.env.REFRESH_KEYS, (error, result) => {
        if (error) {
          return wrapper.response(response, 401, error.message, null);
        }
        payload = {
          userId: result.userId,
          role: result.role,
        };

        token = jwt.sign(payload, process.env.ACCESS_KEYS, {
          expiresIn: "24h",
        });

        newRefreshtoken = jwt.sign(payload, process.env.REFRESH_KEYS, {
          expiresIn: "36h",
        });
        client.setEx(`refreshtoken:${refreshtoken}`, 3600 * 36, refreshtoken);
        return result;
      });
      const result = {
        userId: payload.userId,
        token,
        refreshtoken: newRefreshtoken,
      };

      return wrapper.response(response, 200, "Succes Refresh Token", result);
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
