'use client';
import { useState } from 'react';

type FormData = {
  fullName: string;
  email: string;
  company: string;
  source: string;
  message: string;
};

const initialFormData: FormData = {
  fullName: '',
  email: '',
  company: '',
  source: '',
  message: '',
};

export default function LeadForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  function updateField(field: keyof FormData, value: string) {
    setFormData({
      ...formData,
      [field]: value,
    });
  }

  function validateFormData(formData: FormData) {
    if (!formData.fullName.trim()) {
      return 'Full name is required.';
    }

    if (!formData.email.trim()) {
      return 'Email is required.';
    }

    if (!formData.email.includes('@')) {
      return 'Enter a valid email.';
    }

    if (!formData.source) {
      return 'Choose how you heard about us.';
    }

    return null;
  }


  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setStatusMessage('');

    const validationError = validateFormData(formData);
    if (validationError) {
      setStatusMessage(validationError);
      return;
    }

    setIsSubmitting(true);

    // POST to /api/leads
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        setStatusMessage('Something went wrong. Please try again.');
        return;
      }

      setFormData(initialFormData);
      setStatusMessage('Lead submitted successfully.');
    } catch {
      setStatusMessage('Network error. Please try again.');
    } finally {
      //TODO - handle success state in UI
      setIsSubmitting(false);
    }
  }


  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {statusMessage && (
        <p className="rounded border p-3 text-sm">{statusMessage}</p>
      )}

      <div>
        <label className="block">Full name *</label>
        <input
          className="w-full border p-2"
          value={formData.fullName}
          onChange={(event) => updateField('fullName', event.target.value)}
        />
      </div>

      <div>
        <label className="block">Email *</label>
        <input
          className="w-full border p-2"
          type="email"
          value={formData.email}
          onChange={(event) => updateField('email', event.target.value)}
        />
      </div>

      <div>
        <label className="block">Company</label>
        <input
          className="w-full border p-2"
          value={formData.company}
          onChange={(event) => updateField('company', event.target.value)}
        />
      </div>

      <div>
        <label className="block">How did you hear about us? *</label>
        <select
          className="w-full border p-2"
          value={formData.source}
          onChange={(event) => updateField('source', event.target.value)}
        >
          <option value="">Select one</option>
          <option value="Google">Google</option>
          <option value="Referral">Referral</option>
          <option value="Social">Social</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label className="block">Message</label>
        <textarea
          className="w-full border p-2"
          rows={4}
          value={formData.message}
          onChange={(event) => updateField('message', event.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="border px-4 py-2 disabled:opacity-50"
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}