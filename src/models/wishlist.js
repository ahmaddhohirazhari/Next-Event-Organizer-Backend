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
  getAllWishlist: (offset, limit, id) =>
    new Promise((resolve, reject) => {
      supabase
        .from("wishlist")
        .select(
          `*,
        event(*)`
        )
        .match({ userId: id })
        .range(offset, offset + limit - 1)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  getWishlistById: (id) =>
    new Promise((resolve, reject) => {
      supabase
        .from("wishlist")
        .select(
          `*,
        event(*)`
        )
        .eq("wishlistId", id)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  getWishlistByEventId: (eventId, userId) =>
    new Promise((resolve, reject) => {
      supabase
        .from("wishlist")
        .select(
          `*,
        event(*)`
        )
        .eq("eventId", eventId)
        .eq("userId", userId)
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
};
