const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://ckayyjrypcsbxlcyjoih.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrYXl5anJ5cGNzYnhsY3lqb2loIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjIwODc2NzIsImV4cCI6MTk3NzY2MzY3Mn0.CdVHzUS_AMttVzLLHrhDIf6RmHCaZQ1JA9eVe8xxgt8";
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
