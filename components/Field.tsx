'use client';
import { LeadFormData } from '@/types/lead';

type FieldProps = {
  label: string;
  name: keyof LeadFormData;
  value: string;
  required?: boolean;
  maxLength?: number;
  updateField: (field: keyof LeadFormData, value: string) => void;
};

// label: text above input box
// name: field name in LeadFormData to update state on change in formData
// value: current value of the field, sets input value
// required: boolean to show whether or not the field is required, adds * to label if true
// updateField: useState setter function for the formData that is updated by inputs and sent in POST body
export function TextField({
    label,
    name,
    value,
    required = false,
    updateField,
    maxLength = 100
    }: FieldProps) {
    return (
        <div>
            <label className="block" htmlFor={name}>
            {label} {required && <span className="text-red-500">*</span>}
            </label>

            <input
            id={name}
            name={name}
            className="w-full border p-2"
            value={value}
            onChange={(event) => updateField(name, event.target.value)}
            maxLength={maxLength}
            />
        </div>
    );
}

type SelectFieldProps = FieldProps & {
  options: string[];
  placeholder?: string;
};

// label: text above input box
// name: field name in LeadFormData to update state on change in formData
// value: current value of the field, sets input value
// required: boolean to show whether or not the field is required, adds * to label if true
// updateField: useState setter function for the formData that is updated by inputs and sent in POST body
// options: array of strings to show as options in the select dropdown
// placeholder: optional string to show as the first option with empty value, prompting user to select an option
export function SelectField({
    label,
    name,
    value,
    required = false,
    updateField,
    options,
    placeholder
}: SelectFieldProps) {
    return (
        <div>
            <label className="block" htmlFor={name}>
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <select
                id={name}
                name={name}
                className="w-full border p-2 bg-black text-white"
                value={value}
                onChange={(event) => updateField(name, event.target.value)}
            >
                {placeholder && <option value="" className="">{placeholder}</option>}
                {options.map((option) => (
                    <option key={option} value={option} className="">
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
}

type MessageFieldProps = FieldProps & {
  rows?: number;
};

// label: text above input box
// name: field name in LeadFormData to update state on change in formData
// value: current value of the field, sets input value
// required: boolean to show whether or not the field is required, adds * to label if true
// updateField: useState setter function for the formData that is updated by inputs and sent in POST body
// rows: optional number to set the height of the textarea, defaults to 4
export function MessageField({
  label,
  name,
  value,
  required = false,
  updateField,
  rows = 4,
  maxLength = 300
}: MessageFieldProps) {

  return (
    <div>
      <label className="block" htmlFor={name}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <textarea
        id={name}
        name={name}
        className="w-full border p-2"
        rows={rows}
        value={value}
        maxLength={maxLength}
        onChange={(event) => updateField(name, event.target.value)}
      />

      <p className="mt-1 text-right text-xs text-gray-500">
        {value.length}/{maxLength}
      </p>
    </div>
  );
}
