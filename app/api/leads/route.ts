import { NextResponse } from 'next/server';
import { LeadFormData } from '@/types/lead';
import { supabaseAdmin as supabase } from '@/lib/supabaseAdmin';
import { LEAD_SOURCES, 
        MAX_COMPANY_LENGTH, 
        MAX_EMAIL_LENGTH, 
        MAX_MESSAGE_LENGTH, 
        MAX_NAME_LENGTH,
        isValidEmail } from '@/lib/leadValidation';

const allowedSources = LEAD_SOURCES;

function getErrorResponse(error: string, status: number = 400) {
    return NextResponse.json({ error: error }, { status: status });
}

function isValidSource(source: string | undefined): source is typeof allowedSources[number] {
  return allowedSources.includes(source as typeof allowedSources[number]);
}

type LeadInsert = {
    full_name: string;
    email: string;
    company: string | null;
    hear_about_us: typeof LEAD_SOURCES[number];
    message: string | null;
};

type ValidateLeadResult =
    | { success: true; lead: LeadInsert }
    | { success: false; error: string };

function validateLead(formData: LeadFormData): ValidateLeadResult {
    const fullName = formData.fullName?.trim();
    const email = formData.email?.trim().toLowerCase();
    const company = formData.company?.trim() || null;
    const hearAboutUs = formData.source?.trim();
    const message = formData.message?.trim() || null;
    
    console.log('Parsed fields:', { fullName, email, company, hearAboutUs, message });

    if (!fullName) return {success: false, error: 'Full name is required.'};
    if (!email || !email.includes('@') || !isValidEmail(email)) return {success: false, error: 'A valid email is required.'};
    if (!isValidSource(hearAboutUs)) return {success: false, error: 'Invalid value for referral source.'};

    if (fullName.length > MAX_NAME_LENGTH) return {success: false, error: `Full name must be less than ${MAX_NAME_LENGTH} characters.`};
    if (email.length > MAX_EMAIL_LENGTH) return {success: false, error: `Email must be less than ${MAX_EMAIL_LENGTH} characters.`};
    if (company && company.length > MAX_COMPANY_LENGTH) return {success: false, error: `Company name must be less than ${MAX_COMPANY_LENGTH} characters.`};
    if (message && message.length > MAX_MESSAGE_LENGTH) return {success: false, error: `Message must be less than ${MAX_MESSAGE_LENGTH} characters.`};

    return {
        success: true,
        lead: {
            full_name: fullName,
            email: email,
            company: company,
            hear_about_us: hearAboutUs,
            message: message,
        }
    };
}

async function checkExistingLead(email: string) {
    const { data: existingLead, error } = await supabase
    .from('leads')
    .select('id')
    .eq('email', email)
    .maybeSingle();

    return { existingLead, error };
}

// POST /api/leads
// add form data to supabase table and forward to webhook
export async function POST(request: Request) {
    //TODO - implement this, add form data to supabase table and forward to webhook
    let formData: LeadFormData;
    try {
        formData = await request.json();
    } catch (error) {
        console.error('Invalid JSON body:', error);
        return getErrorResponse('Invalid request body.', 400);
    }

    console.log('Received data:', formData);

    const lead = validateLead(formData);
    if (!lead.success) {
        return getErrorResponse(lead.error, 400);
    }
    const { existingLead, error: existingLeadError } = await checkExistingLead(lead.lead.email);
    if (existingLeadError) {
        console.error('Error checking existing leads:', existingLeadError);
        return getErrorResponse('Could not check existing leads.', 500);
    }
    if (existingLead) return getErrorResponse('This email is already registered!', 409);

    // safe to insert now
    const { data, error } = await supabase
    .from('leads')
    .insert(lead.lead)
    .select()
    .single();

    if (error) {
        console.log('Supabase insert error:', error);
        return getErrorResponse('Error saving lead: ' + error.message, 500);
    }

    console.log('Saved lead: ', data);

    return NextResponse.json({ message: 'Lead saved successfully', lead: data }, { status: 201 });

}
