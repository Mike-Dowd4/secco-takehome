import { supabaseAdmin } from "./supabaseAdmin";

export async function getLeads() {
  return supabaseAdmin
    .from("leads")
    .select("id, full_name, email, company, hear_about_us, created_at")
    .order("created_at", { ascending: false });
}
