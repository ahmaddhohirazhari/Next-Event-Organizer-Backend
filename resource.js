QUERY BUILDER JOIN 2 TABLE ======================================================================================
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://mbybybaagdfdddqwfayh.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ieWJ5YmFhZ2RmZGRkcXdmYXloIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjIwODc2NjYsImV4cCI6MTk3NzY2MzY2Nn0.s8Ty6YMi4Nj1Hioio4jUzkNtvyWaCcG_LFAr294A1OY";
const supabase = createClient(supabaseUrl, supabaseKey);

// const getData = async () => {
//   const { data, error } = await supabase.from("tblWishlist").select(`*,
//       tblUser ( * )
//       `);
//   console.log(data);
//   console.log(error);
// };

// const getData = async () => {
//   const { data, error } = await supabase.from("tblWishlist").select(`*,
//     tblUser:userId ( * ),
//     tblEvent:eventId ( * )
//     `);
//   console.log(data);
//   console.log(error);
// };

// WITH VIEW
const getData = async () => {
  const { data, error } = await supabase
    .from("viewwishlistuser")
    .select(`*`)
    .eq("userId", "ca2973ed-9414-4135-84ac-799b6602d7b1");
  console.log(data);
  console.log(error);
};

getData();


ROUTES PRODUCT ===============================================
const express = require("express");

const Router = express.Router();

const productController = require("../controllers/product");

// Router.get("/greetings", async (request, response) => {
// try {
//     response.status(200).send("Hello World!");
// } catch (error) {
//     console.log(error)
// }
// });

Router.get("/greetings", productController.showGreetings);
// Path Create
// Path Read
// Path Update
// Path Delete
Router.get("/", productController.getAllProduct);
Router.get("/:id", productController.getProductById);
Router.post("/", productController.createProduct);
Router.patch("/:id", productController.updateProduct);
Router.delete("/:id", productController.deleteProduct);

module.exports = Router;


CONTROLLER PRODUCT ===========================================
const productModel = require("../models/product");
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
  getAllProduct: async (request, response) => {
    try {
      console.log(request.query);
      let { page, limit } = request.query;
      page = +page;
      limit = +limit;

      const totalData = await productModel.getCountProduct();
      const totalPage = Math.ceil(totalData / limit);
      const pagination = {
        // page, totalPage, limit, totalData
        page,
        totalPage,
        limit,
        totalData,
      };

      const offset = page * limit - limit;

      const result = await productModel.getAllProduct(offset, limit);
      return wrapper.response(
        response,
        result.status,
        "Success Get Data !",
        result.data,
        pagination
      );
    } catch (error) {
      console.log(error);
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },
  getProductById: async (request, response) => {
    try {
      // const request = {
      //   // ...
      //   params: { id: "12345678" },
      //   // ...
      // };
      const { id } = request.params;

      const result = await productModel.getProductById(id);

      if (result.data.length < 1) {
        return wrapper.response(
          response,
          404,
          `Data By Id ${id} Not Found`,
          []
        );
      }

      return wrapper.response(
        response,
        result.status,
        "Success Get Data By Id",
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
  createProduct: async (request, response) => {
    try {
      console.log(request.body);
      const { name, price } = request.body;
      const setData = {
        name,
        price,
      };

      const result = await productModel.createProduct(setData);

      return wrapper.response(
        response,
        result.status,
        "Success Create Data",
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
  updateProduct: async (request, response) => {
    try {
      console.log(request.params);
      console.log(request.body);
      const { id } = request.params;
      const { name, price } = request.body;

      const checkId = await productModel.getProductById(id);

      if (checkId.data.length < 1) {
        return wrapper.response(
          response,
          404,
          `Data By Id ${id} Not Found`,
          []
        );
      }

      const setData = {
        name,
        price,
      };

      const result = await productModel.updateProduct(id, setData);

      return wrapper.response(
        response,
        result.status,
        "Success Update Data",
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
  deleteProduct: async (request, response) => {
    try {
      // 1. ngecek apakah idnya itu ada atau tidak ?
      // 1.a. jika tidak ada maka akan mengembalikan id tidak ada di database
      // 1.b. jika ada maka akan menjalankan proses delete
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
};

// request.query = bisa digunakan untuk fitur paginasi, sort,search di method get
// request.params = bisa digunakan untuk fitur getdatabyid, updatedata, deletedata
// request.body = bsa digunakan untuk fitur create/update


MODEL PRODUCT =============================================================================
const supabase = require("../config/supabase");

module.exports = {
  showGreetings: () => new Promise((resolve, reject) => {}),
  getCountProduct: () =>
    new Promise((resolve, reject) => {
      supabase
        .from("product")
        .select("*", { count: "exact" })
        .then((result) => {
          if (!result.error) {
            resolve(result.count);
          } else {
            reject(result);
          }
        });
    }),
  getAllProduct: (offset, limit) =>
    new Promise((resolve, reject) => {
      // page = 1
      // limit = 10
      // offset = 0
      // .range(0, 9) // offset(0) + limit(10) - 1 = 9
      supabase
        .from("product")
        .select("*")
        .range(offset, offset + limit - 1)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  // new Promise(async (resolve, reject) => {
  //   const result = await supabase.from("product").select("*");
  //   console.log(result);
  // }),
  getProductById: (id) =>
    new Promise((resolve, reject) => {
      // SELECT * FROM product WHERE id = "123"
      supabase
        .from("product")
        .select("*")
        .eq("id", id)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  createProduct: (data) =>
    new Promise((resolve, reject) => {
      supabase
        .from("product")
        .insert([data]) // insert([{name: "Tea", price: 5000}])
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  updateProduct: (id, data) =>
    new Promise((resolve, reject) => {
      supabase
        .from("product")
        .update(data)
        .eq("id", id)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
};

