"use client";
import { BaseFieldProps } from "./types";
import {
  MAX_NAME_LENGTH,
  MAX_EMAIL_LENGTH,
  MAX_COMPANY_LENGTH,
  MAX_LENGTHS,
} from "@/lib/leadValidation";

export function TextField({
  label,
  name,
  value,
  required = false,
  updateField,
}: BaseFieldProps) {
  const maxLength = MAX_LENGTHS[name as keyof typeof MAX_LENGTHS];

  return (
    <div>
      <label className="block text-white" htmlFor={name}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <input
        id={name}
        name={name}
        className="w-full border border-gray-600 bg-gray-800 text-white p-2 rounded focus:border-blue-500 focus:outline-none"
        value={value}
        onChange={(event) => updateField(name, event.target.value)}
        maxLength={maxLength}
      />
    </div>
  );
}
