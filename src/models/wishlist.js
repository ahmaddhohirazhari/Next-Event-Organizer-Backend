const supabase = require("../config/supabase");
const wishlist = require("../controllers/wishlist");
const user = require("./user");

module.exports = {
  createWishlist: () =>
    new Promise((resolve, reject) => {
      supabase
        .from("wishlist")
        .select(
          `wishlistId,
        eventId:event(eventId),
        userId:user(userId)`
        )
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
          `wishlistId,
        eventId:event(eventId),
        userId:user(userId)`
        )
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
};
