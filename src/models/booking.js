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
  getBookingByUserId: (id) =>
    new Promise((resolve, reject) => {
      supabase
        .from("booking")
        .select("*")
        .eq("userId", id)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  updateBooking: (id, data) =>
    new Promise((resolve, reject) => {
      supabase
        .from("booking")
        .update(data)
        .eq("bookingId", id)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  deleteBooking: (id, data) =>
    new Promise((resolve, reject) => {
      supabase
        .from("booking")
        .delete(data)
        .eq("bookingId", id)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
};
