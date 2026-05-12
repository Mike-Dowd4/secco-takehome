"use client";
import { BaseFieldProps } from "./types";
import { MAX_MESSAGE_LENGTH } from "@/lib/leadValidation";

type MessageFieldProps = BaseFieldProps & {
  // optional number to set the height of the textarea, defaults to 4
  rows?: number;
};

export function MessageField({
  label,
  name,
  value,
  required = false,
  updateField,
  rows = 4,
}: MessageFieldProps) {
  return (
    <div>
      <label className="block text-white" htmlFor={name}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <textarea
        id={name}
        name={name}
        className="w-full border border-gray-600 bg-gray-800 text-white p-2 rounded focus:border-blue-500 focus:outline-none resize-vertical"
        rows={rows}
        value={value}
        maxLength={MAX_MESSAGE_LENGTH}
        onChange={(event) => updateField(name, event.target.value)}
      />

      <p className="mt-1 text-right text-xs text-gray-400">
        {value.length}/{MAX_MESSAGE_LENGTH}
      </p>
    </div>
  );
}
