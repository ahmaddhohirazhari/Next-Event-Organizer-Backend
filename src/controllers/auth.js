const jwt = require("jsonwebtoken");
const encryptPassword = require("encrypt-password");
const authModel = require("../models/auth");
const wrapper = require("../utils/wrapper");

module.exports = {
  showGreetings: async (request, response) => {
    try {
      // return response.status(200).send("Hello World!");
      return wrapper.response(
        response,
        200,
        "Success Get Greetings",
        "Hello World !"
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
  register: async (request, response) => {
    try {
      console.log(request.body);
      const {
        name,
        username,
        gender,
        profession,
        nationality,
        dateOfBirth,
        email,
        password,
        role,
      } = request.body;
      const { filename, mimetype } = request.file;

      // 2. PROSES VALIDASI PASSWORD
      if (password.length < 6) {
        return wrapper.response(
          response,
          400,
          "At Least 6 Character Password",
          null
        );
      }

      const encryptedPassword = encryptPassword(password, {
        min: 6,
        max: 24,
        pattern: /^\w{6,24}$/,
        signature: "signature",
      });

      const setData = {
        name,
        username,
        gender,
        profession,
        nationality,
        dateOfBirth,
        email,
        password: encryptedPassword, // UNTUK PASSWORD BISA DI ENKRIPSI
        role,
        image: filename ? `${filename}.${mimetype.split("/")[1]}` : "",
      };

      // PROSES PENGECEKAN APAKAH EMAIL YANG MAU DI DAFTARKAN SUDAH ADA ATAU BELUM ?
      const checkEmail = await authModel.getUserByEmail(email);
      if (checkEmail.data.length > 0) {
        return wrapper.response(response, 404, "Email Alredy Registered", null);
      }

      // PROSES MENYIMPAN DATA KE DATABASE LEWAT MODEL
      const result = await authModel.register(setData);

      return wrapper.response(
        response,
        result.status,
        "Successfully Registered",
        result.data
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
  login: async (request, response) => {
    try {
      const { email, password } = request.body;

      // const setLogin = {
      //   email,
      //   password, // UNTUK PASSWORD BISA DI ENKRIPSI
      // };
      // 1. PROSES PENGECEKAN EMAIL
      const checkEmail = await authModel.getUserByEmail(email);
      if (checkEmail.data.length < 1) {
        return wrapper.response(response, 404, "Email Not Registed", null);
      }

      // 2. PROSES PENCOCOKAN PASSWORD
      if (password !== checkEmail.data[0].password) {
        return wrapper.response(response, 400, "Wrong Password", null);
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

      const token = jwt.sign(payload, "RAHASIA", { expiresIn: "24h" });

      // 4. PROSES RESPON KE USER
      return wrapper.response(response, 200, "Success Login", {
        userId: payload.userId,
        token,
      });
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
