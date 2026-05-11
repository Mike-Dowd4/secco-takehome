'use client';
import { useState } from 'react';
import { LeadFormData } from '@/types/lead';
import { TextField, SelectField, MessageField } from './Field';


const initialFormData: LeadFormData = {
	fullName: '',
	email: '',
	company: '',
	source: '',
	message: '',
};

export default function LeadForm() {
	const [formData, setFormData] = useState<LeadFormData>(initialFormData);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [statusMessage, setStatusMessage] = useState('');

	function updateField(field: keyof LeadFormData, value: string) {
		setFormData({
			...formData,
			[field]: value,
		});
	}

	// Validates email using simple regex pattern from https://stackoverflow.com/a/9204568 
	function isValidEmail(email: string) {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	}
	
	function validateFormData(formData: LeadFormData) {
		if (!formData.fullName.trim()) {
			return 'Full name is required.';
		}

		if (!formData.email.trim() || !isValidEmail(formData.email)) {
			return 'A valid email is required.';
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
				// TODO: handle error messages from server and display to user
				setStatusMessage('Something went wrong. Please try again.');
				return;
			}

			const result = await response.json();
			console.log('Server response:', result);

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
				options={['Google', 'Referral', 'Social', 'Other']}
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
				className="border px-4 py-2 disabled:opacity-50 hover:cursor-pointer mx-auto block"
			>
				{isSubmitting ? 'Submitting...' : 'Submit'}
			</button>
		</form>
	);
}