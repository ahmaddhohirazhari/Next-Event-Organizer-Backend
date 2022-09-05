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
  getAllWishlist: () =>
    new Promise((resolve, reject) => {
      supabase
        .from("wishlist")
        .select(
          `
        *,event(name,category),
        user(name)
        `
        )
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
