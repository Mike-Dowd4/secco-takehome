import { LeadFormData } from "@/types/lead";

type SubmitLeadResult =
  | { success: true; data: unknown; webhookStatus: boolean }
  | { success: false; error: string; status?: number };

export async function submitLead(
  formData: LeadFormData,
): Promise<SubmitLeadResult> {
  try {
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        status: response.status,
        error:
          data?.error ||
          (response.status === 409
            ? "That email has already been registered."
            : "Something went wrong. Please try again."),
      };
    }

    return {
      success: true,
      data,
      webhookStatus: data.webhookStatus,
    };
  } catch {
    return {
      success: false,
      error: "Network error. Please try again.",
    };
  }
}
