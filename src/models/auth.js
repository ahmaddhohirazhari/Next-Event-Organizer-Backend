const supabase = require("../config/supabase");

module.exports = {
  // showGreetings: () => new Promise((resolve, reject) => {}),
  getUserByEmail: (email) =>
    new Promise((resolve, reject) => {
      supabase
        .from("user")
        .select("*")
        .eq("email", email)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  register: (data) =>
    new Promise((resolve, reject) => {
      supabase
        .from("user")
        .insert([data])
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
};
