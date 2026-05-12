"use client";
import { BaseFieldProps } from "./types";

type SelectFieldProps = BaseFieldProps & {
  // array of strings to show as options in the select dropdown
  options: readonly string[];

  // optional string to show as the first option with empty value, prompting user to select an option
  placeholder?: string;
};

export function SelectField({
  label,
  name,
  value,
  required = false,
  updateField,
  options,
  placeholder,
}: SelectFieldProps) {
  return (
    <div>
      <label className="block text-white" htmlFor={name}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        id={name}
        name={name}
        className="w-full border border-gray-600 bg-gray-800 text-white p-2 rounded focus:border-blue-500 focus:outline-none"
        value={value}
        onChange={(event) => updateField(name, event.target.value)}
      >
        {placeholder && (
          <option value="" className="bg-gray-800">
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option} value={option} className="bg-gray-800">
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
