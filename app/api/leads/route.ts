import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

type LeadFormData = {
  fullName?: string;
  email?: string;
  company?: string;
  source?: string;
  message?: string;
};

const allowedSources = ['Google', 'Referral', 'Social', 'Other'] as const;

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

function getErrorResponse(error: string, status: number = 400) {
    return NextResponse.json({ error: error }, { status: status });
}

// Validates email using simple regex pattern from https://stackoverflow.com/a/9204568 
function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidSource(source: string | undefined): source is typeof allowedSources[number] {
  return allowedSources.includes(source as typeof allowedSources[number]);
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

    const fullName = formData.fullName?.trim();
    const email = formData.email?.trim().toLowerCase();
    const company = formData.company?.trim() || null;
    const hearAboutUs = formData.source?.trim();
    const message = formData.message?.trim() || null;
    
    console.log('Parsed fields:', { fullName, email, company, hearAboutUs, message });

    if (!fullName) return getErrorResponse('Full name is required.');
    if (!email || !email.includes('@') || !isValidEmail(email)) return getErrorResponse('A valid email is required.');
    if (!isValidSource(hearAboutUs)) return getErrorResponse('Invalid value for referral source.');
    if (message && message.length > 300) return getErrorResponse('Message must be less than 300 characters.');
    if (company && company.length > 300) return getErrorResponse('Company name must be less than 300 characters.');

    const { data: existingLead, error: existingLeadError } = await supabase
    .from('leads')
    .select('id')
    .eq('email', email)
    .maybeSingle();

    if (existingLead) return getErrorResponse('This email is already registered!', 409);
    if (existingLeadError) return getErrorResponse('Error checking existing leads: ' + existingLeadError.message, 500);

    const lead = {
        full_name: fullName,
        email: email,
        company: company,
        hear_about_us: hearAboutUs,
        message: message,
    };

    // safe to insert now
    const { data, error } = await supabase
    .from('leads')
    .insert(lead)
    .select()
    .single();

    if (error) {
        console.log('Supabase insert error:', error);
        return getErrorResponse('Error saving lead: ' + error.message, 500);
    }

    console.log('Saved lead: ', data);

    return NextResponse.json({ message: 'Lead saved successfully', lead: data }, { status: 201 });

}
