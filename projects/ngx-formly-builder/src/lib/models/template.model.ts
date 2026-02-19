import { FormlyFieldConfig } from '@ngx-formly/core';

export interface Template {
  id: string;
  name: string;
  description?: string;
  fields: FormlyFieldConfig[];
  categoryId: string;
}

export interface TemplateCategory {
  id: string;
  name: string;
  icon: string;
  templates: Template[];
}
