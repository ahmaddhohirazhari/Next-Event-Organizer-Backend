const supabase = require("../src/config/supabase");

const getData = async () => {
  const { data, error } = await supabase.from("wishlist").select(`
  *,user(user),event(*)`);

  console.log(data);
  console.log(error);
};

getData();
