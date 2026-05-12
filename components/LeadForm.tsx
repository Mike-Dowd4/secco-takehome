'use client';
import { useState } from 'react';
import { LeadFormData } from '@/types/lead';
import { TextField, SelectField, MessageField } from './Field';
import { MAX_NAME_LENGTH, 
		MAX_EMAIL_LENGTH, 
		MAX_COMPANY_LENGTH, 
		MAX_MESSAGE_LENGTH,
		LEAD_SOURCES,
		isValidEmail } from '@/lib/leadValidation';
import { submitLead } from '@/lib/leadApi';


const initialFormData: LeadFormData = {
	fullName: '',
	email: '',
	company: '',
	source: '',
	message: '',
};

function scrollToTop() {
	window.scrollTo({
		top: 0,
		behavior: 'smooth',
	});
}

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

	function validateMaxLength(value: string, name: string, maxLength: number) {
		if (value.length > maxLength) {
			return `${name} must be less than ${maxLength} characters.`;
		}
		return null;
	}
	
	function validateFormData(formData: LeadFormData) {
		const fullName = formData.fullName.trim();
		const email = formData.email.trim();
		const company = formData.company.trim();
		const message = formData.message.trim();

		if (!fullName) {
			return 'Full name is required.';
		}

		if (!email || !isValidEmail(email)) {
			return 'A valid email is required.';
		}

		if (!formData.source) {
			return 'Choose how you heard about us.';
		}

		return (
			validateMaxLength(fullName, 'Full name', MAX_NAME_LENGTH) ||
			validateMaxLength(email, 'Email', MAX_EMAIL_LENGTH) ||
			validateMaxLength(company, 'Company', MAX_COMPANY_LENGTH) ||
			validateMaxLength(message, 'Message', MAX_MESSAGE_LENGTH)
		);
	}

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setStatusMessage('');

		const validationError = validateFormData(formData);
		if (validationError) {
			setStatusType('error');
			setStatusMessage(validationError);
			scrollToTop();
			return;
		}

		setIsSubmitting(true);

		// POST to /api/leads
		try {
			const result = await submitLead(formData);
			if (!result.success) {
				setStatusType('error');
				setStatusMessage(result.error);
				return;
			}
			setFormData(initialFormData);
			setStatusType('success');
			setStatusMessage('Lead submitted successfully!');
		} catch (error) {
			setStatusType('error');
			setStatusMessage('An unexpected error occurred. Please try again.');
		} finally {
			setIsSubmitting(false);
			scrollToTop();
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
				options={LEAD_SOURCES}
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
