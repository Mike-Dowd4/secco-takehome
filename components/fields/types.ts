import { LeadFormData } from "@/types/lead";

export type BaseFieldProps = {
  // text above input box
  label: string;

  // field name in LeadFormData to update state on change in formData
  name: keyof LeadFormData;

  // current value of the field, sets input value
  value: string;

  // boolean to show whether or not the field is required, adds * to label if true
  required?: boolean;

  // useState setter function for the formData that is updated by inputs and sent in POST body
  updateField: (field: keyof LeadFormData, value: string) => void;
};
