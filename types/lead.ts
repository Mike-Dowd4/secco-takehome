// This is the formData format we expect from the frontend, and the format we use for validation
export type LeadFormData = {
  fullName: string;
  email: string;
  company: string;
  source: string;
  message: string;
};

// This is the format for Leads in the Supabase table and API responses
export type Lead = {
    id: number;
    full_name: string;
    email: string;
    company: string | null;
    hear_about_us: string;
    created_at: string;
};