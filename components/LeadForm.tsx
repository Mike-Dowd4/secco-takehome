'use client';
import { useState } from 'react';
import { LeadFormData } from '@/types/lead';
import { TextField, SelectField, MessageField } from './Field';
import { MAX_NAME_LENGTH, 
		MAX_EMAIL_LENGTH, 
		MAX_COMPANY_LENGTH, 
		MAX_MESSAGE_LENGTH, 
		isValidEmail } from '@/lib/leadValidation';


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
	const [statusType, setStatusType] = useState<'success' | 'error'>('error');

	function updateField(field: keyof LeadFormData, value: string) {
		setFormData({
			...formData,
			[field]: value,
		});
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

		if (formData.fullName.length > MAX_NAME_LENGTH) {
			return `Full name must be less than ${MAX_NAME_LENGTH} characters.`;
		}

		if (formData.email.length > MAX_EMAIL_LENGTH) {
			return `Email must be less than ${MAX_EMAIL_LENGTH} characters.`;
		}

		if (formData.company.length > MAX_COMPANY_LENGTH) {
			return `Company must be less than ${MAX_COMPANY_LENGTH} characters.`;
		}

		if (formData.message.length > MAX_MESSAGE_LENGTH) {
			return `Message must be less than ${MAX_MESSAGE_LENGTH} characters.`;
		}

		return null;
	}


	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		console.log("handleSubmit");

		setStatusMessage('');

		const validationError = validateFormData(formData);
		if (validationError) {
			setStatusType('error');
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
				if (response.status === 409) {
					setStatusType('error');
					setStatusMessage('That email has already been registered.');
				} else {
					setStatusType('error');
					setStatusMessage('Something went wrong. Please try again.');
				}
				return;
			}

			const result = await response.json();
			console.log('Server response:', result);

			setFormData(initialFormData);
			setStatusType('success');
			setStatusMessage('Lead submitted successfully.');
		} catch {
			setStatusMessage('Network error. Please try again.');
		} finally {
			setIsSubmitting(false);
		}
	}


	return (
		<form onSubmit={handleSubmit} method='POST' className="space-y-4">
			{statusMessage && (
				<p className={`rounded border p-3 text-sm 
				${statusType === 'error' ? 'text-red-500' : 'text-green-500'}`}>
					{statusMessage}
				</p>
			)}

			<TextField
				label="Full Name"
				name="fullName"
				value={formData.fullName}
				required={true}
				maxLength={MAX_NAME_LENGTH}
				updateField={updateField}
			/>

			<TextField
				label="Email"
				name="email"
				value={formData.email}
				required={true}
				maxLength={MAX_EMAIL_LENGTH}
				updateField={updateField}
			/>

			<TextField
				label="Company"
				name="company"
				value={formData.company}
				maxLength={MAX_COMPANY_LENGTH}
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
				maxLength={MAX_MESSAGE_LENGTH}
			/>

			<button
				type="submit"
				disabled={isSubmitting}
				className="mx-auto block border px-4 py-2 transition-all duration-200 ease-in-out hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 hover:cursor-pointer"
			>
				{isSubmitting && (
				<span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-black" />
				)}
				{isSubmitting ? 'Submitting...' : 'Submit'}
			</button>
		</form>
	);
}
