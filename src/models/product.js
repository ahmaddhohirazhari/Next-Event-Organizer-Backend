const supabase = require("../config/supabase");

module.exports = {
  showGreetings: () => new Promise((resolve, reject) => {}),
  getAllProduct: () =>
    new Promise((resolve, reject) => {
      supabase
        .from("product")
        .select("*")
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),

  getProductById: (id) =>
    new Promise((resolve, reject) => {
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
};
