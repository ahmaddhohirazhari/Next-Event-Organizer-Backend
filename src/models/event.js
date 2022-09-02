const supabase = require("../config/supabase");

module.exports = {
  showGreetings: () => new Promise((resolve, reject) => {}),
  getAllEvent: () =>
    new Promise((resolve, reject) => {
      supabase
        .from("event")
        .select("*")
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  // new Promise(async (resolve, reject) => {
  //   const result = await supabase.from("Event").select("*");
  //   console.log(result);
  // }),
  getEventById: (eventId) =>
    new Promise((resolve, reject) => {
      // SELECT * FROM Event WHERE eventId = "123"
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
