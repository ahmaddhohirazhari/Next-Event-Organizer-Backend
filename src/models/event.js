const supabase = require("../config/supabase");

module.exports = {
  getCountEvent: () =>
    new Promise((resolve, reject) => {
      supabase
        .from("event")
        .select("*", { count: "exact" })
        .then((result) => {
          if (!result.error) {
            resolve(result.count);
          } else {
            reject(result);
          }
        });
    }),
  getAllEvent: (offset, limit, name) =>
    new Promise((resolve, reject) => {
      supabase
        .from("event")
        .select("*")
        .range(offset, offset + limit - 1)
        .ilike("name", `%${name}%`)
        .order("createAt", { ascending: true })
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  getEventById: (eventId) =>
    new Promise((resolve, reject) => {
      supabase
        .from("event")
        .select("*")
        .eq("eventId", eventId)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  createEvent: (data) =>
    new Promise((resolve, reject) => {
      supabase
        .from("event")
        .insert([data])
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  deleteEvent: (id) =>
    new Promise((resolve, reject) => {
      supabase
        .from("event")
        .delete()
        .eq("eventId", id)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  updateEvent: (id, data) =>
    new Promise((resolve, reject) => {
      supabase
        .from("event")
        .update(data)
        .eq("eventId", id)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
};
