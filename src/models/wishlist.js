const supabase = require("../config/supabase");

module.exports = {
  createWishlist: (data) =>
    new Promise((resolve, reject) => {
      supabase
        .from("wishlist")
        .insert([data])
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  getCountWishlist: () =>
    new Promise((resolve, reject) => {
      supabase
        .from("wishlist")
        .select("*", { count: "exact" })
        .then((result) => {
          if (!result.error) {
            resolve(result.count);
          } else {
            reject(result);
          }
        });
    }),
  getAllWishlist: (offset, limit) =>
    new Promise((resolve, reject) => {
      supabase
        .from("wishlist")
        .select(
          `*,
        event(name,category)`
        )
        .range(offset, offset + limit - 1)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  getWishlistById: (wishlistId) =>
    new Promise((resolve, reject) => {
      // SELECT * FROM WIshlist WHERE WIshlistId = "123"
      supabase
        .from("wishlist")
        .select("*")
        .eq("wishlistId", wishlistId)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  deleteWishlist: (id) =>
    new Promise((resolve, reject) => {
      supabase
        .from("wishlist")
        .delete()
        .eq("wishlistId", id)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  // updateWishlist:()=>{

  // }
};
