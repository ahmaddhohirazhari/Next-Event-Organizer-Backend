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
  getAllBooking: (offset, limit, id) =>
    new Promise((resolve, reject) => {
      supabase
        .from("booking")
        .select(`*,bookingSection(sectionId,section,statusUsed)`)
        .eq("userId", id)
        .range(offset, offset + limit - 1)
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
        bookingSection(sectionId,section,statusUsed)`
        )
        .eq("userId", userId)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  getCountBooking: () =>
    new Promise((resolve, reject) => {
      supabase
        .from("booking")
        .select("*", { count: "exact" })
        .then((result) => {
          if (!result.error) {
            resolve(result.count);
          } else {
            reject(result);
          }
        });
    }),
  getBookingSection: (eventId) =>
    new Promise((resolve, reject) => {
      supabase
        .from("booking")
        .select(`bookingId, eventId, statusPayment, bookingSection ( section )`)
        .eq("eventId", eventId)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
};
