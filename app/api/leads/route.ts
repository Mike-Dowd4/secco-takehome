import { NextResponse } from "next/server";
import { LeadFormData } from "@/types/lead";
import { supabaseAdmin as supabase } from "@/lib/supabaseAdmin";
import {
  LEAD_SOURCES,
  isValidSource,
  validateFormData,
} from "@/lib/leadValidation";

function getErrorResponse(error: string, status: number = 400) {
  return NextResponse.json({ error: error }, { status: status });
}

type LeadInsert = {
  full_name: string;
  email: string;
  company: string | null;
  hear_about_us: (typeof LEAD_SOURCES)[number];
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

  const errorMessage = validateFormData(formData);

  if (errorMessage) {
    return { success: false, error: errorMessage };
  }

  if (!isValidSource(hearAboutUs)) {
    return { success: false, error: "Invalid value for referral source." };
  }

  return {
    success: true,
    lead: {
      full_name: fullName,
      email: email,
      company: company,
      hear_about_us: hearAboutUs,
      message: message,
    },
  };
}

async function insertLead(lead: LeadInsert) {
  const { data, error } = await supabase
    .from("leads")
    .insert(lead)
    .select()
    .single();

  return { data, error };
}

async function sendLeadToWebhook(lead: LeadInsert): Promise<boolean> {
  const webhookUrl = process.env.WEBHOOK_URL;
  const candidateName = "Mike Dowd";

  if (!webhookUrl) {
    console.error("Webhook URL is missing from environment variables.");
    return false;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Candidate-Name": candidateName,
      },
      body: JSON.stringify(lead),
    });

    if (!response.ok) {
      throw new Error(`Webhook responded with status ${response.status}`);
    }
    return true;
  } catch (error) {
    console.error("Webhook request error:", error);
    return false;
  }
}

// POST /api/leads
// add form data to supabase table and forward to webhook
export async function POST(request: Request) {
  let formData: LeadFormData;
  try {
    formData = await request.json();
  } catch (error) {
    console.error("Invalid JSON body:", error);
    return getErrorResponse("Invalid request body.", 400);
  }

  const lead = validateLead(formData);
  if (!lead.success) {
    return getErrorResponse(lead.error, 400);
  }

  const { data, error } = await insertLead(lead.lead);

  if (error) {
    console.error("Supabase insert error:", error);

    if (error.code === "23505") {
      return getErrorResponse("This email is already registered!", 409);
    }

    return getErrorResponse("Error saving lead: " + error.message, 500);
  }

  console.log("Saved lead: ", data);

  const webhookSuccess = await sendLeadToWebhook(lead.lead);

  return NextResponse.json(
    {
      message: "Lead saved successfully",
      lead: data,
      webhookStatus: webhookSuccess,
    },
    { status: 201 },
  );
}
