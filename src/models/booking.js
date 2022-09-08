const supabase = require("../config/supabase");

module.exports = {
  createBooking: (data) =>
    new Promise((resolve, reject) => {
      supabase
        .from("booking")
        .insert([data])
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  createBookingSection: (bookingId, section, statusUsed) =>
    new Promise((resolve, reject) => {
      supabase
        .from("bookingSection")
        .insert([{ bookingId, section, statusUsed }])
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  getAllBooking: () =>
    new Promise((resolve, reject) => {
      supabase
        .from("booking")
        .select("*")
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  getBookingByUserId: (userId) =>
    new Promise((resolve, reject) => {
      supabase
        .from("booking")
        .select(
          `*,
        bookingSection(*)`
        )
        .match({ userId })
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
};
