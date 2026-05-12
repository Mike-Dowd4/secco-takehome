"use client";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { LeadFormData } from "@/types/lead";
import { TextField, SelectField, MessageField } from "./fields";
import { LEAD_SOURCES, validateFormData } from "@/lib/leadValidation";
import { submitLead } from "@/lib/leadApi";

const initialFormData: LeadFormData = {
  fullName: "",
  email: "",
  company: "",
  source: "",
  message: "",
};

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

export default function LeadForm() {
  const [formData, setFormData] = useState<LeadFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error">("error");

  function updateField(field: keyof LeadFormData, value: string) {
    setFormData({
      ...formData,
      [field]: value,
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatusMessage("");

    const validationError = validateFormData(formData);
    if (validationError) {
      setStatusType("error");
      setStatusMessage(validationError);
      scrollToTop();
      return;
    }

    setIsSubmitting(true);

    // POST to /api/leads
    try {
      const result = await submitLead(formData);
      if (!result.success) {
        setStatusType("error");
        setStatusMessage(result.error);
        return;
      }
      if (!result.webhookStatus) {
        toast.error("Lead submitted, but forward to webhook failed.");
      }
      setFormData(initialFormData);
      setStatusType("success");
      setStatusMessage("Lead submitted successfully!");
    } catch (error) {
      console.error("Error submitting lead:", error);
      setStatusType("error");
      setStatusMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
      scrollToTop();
    }
  }

  return (
    <form onSubmit={handleSubmit} method="POST" className="space-y-4">
      {statusMessage && (
        <p
          className={`rounded border p-3 text-sm 
				${statusType === "error" ? "text-red-500" : "text-green-500"}`}
        >
          {statusMessage}
        </p>
      )}

      <TextField
        label="Full Name"
        name="fullName"
        value={formData.fullName}
        required={true}
        updateField={updateField}
      />

      <TextField
        label="Email"
        name="email"
        value={formData.email}
        required={true}
        updateField={updateField}
      />

      <TextField
        label="Company"
        name="company"
        value={formData.company}
        updateField={updateField}
      />

      <SelectField
        label="How did you hear about us?"
        name="source"
        value={formData.source}
        required={true}
        updateField={updateField}
        options={LEAD_SOURCES}
        placeholder="Select one"
      />

      <MessageField
        label="Message"
        name="message"
        value={formData.message}
        updateField={updateField}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="mx-auto block border border-gray-600 bg-gray-800 text-white px-4 py-2 rounded transition-all duration-200 ease-in-out hover:bg-gray-700 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-gray-800 hover:cursor-pointer"
      >
        {isSubmitting && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-white inline-block mr-2" />
        )}
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
