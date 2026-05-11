import { supabaseAdmin } from './supabaseAdmin';

export type Lead = {
    id: number;
    full_name: string;
    email: string;
    company: string | null;
    hear_about_us: string;
    created_at: string;
};

export async function getLeads() {
    return supabaseAdmin
    .from('leads')
    .select('id, full_name, email, company, hear_about_us, created_at')
    .order('created_at', { ascending: false });
}