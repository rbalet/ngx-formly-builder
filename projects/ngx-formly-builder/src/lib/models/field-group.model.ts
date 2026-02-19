export interface FieldType {
  type: string;
  label: string;
  icon: string;
  description: string;
}

export interface FieldGroup {
  category: string;
  fields: FieldType[];
}
