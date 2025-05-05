import { createClient } from "@supabase/supabase-js";
export const supabaseUrl = "https://uhyjjdtjwsakrcgmoncn.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoeWpqZHRqd3Nha3JjZ21vbmNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2NTAzNTgsImV4cCI6MjA2MTIyNjM1OH0.CRppKINZVP2yMpsz7bFv1Iebxcr7hiFckMWmONOXbL0";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
