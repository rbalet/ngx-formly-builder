import { Injectable, signal } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

@Injectable({
  providedIn: 'root',
})
export class FormBuilderService {
  $fields = signal<FormlyFieldConfig[]>([]);
  $selectedField = signal<FormlyFieldConfig | null>(null);

  addField(field: FormlyFieldConfig) {
    this.$fields.update((fields) => [...fields, field]);
  }

  updateFields() {
    this.$fields.update((fields) => [...fields]);
  }

  duplicateField(field: FormlyFieldConfig) {
    const duplicatedField: FormlyFieldConfig = {
      ...field,
      key: `${field.key}_copy_${Date.now()}`,
      props: { ...field.props },
    };

    // If the field has options, duplicate them as well
    if (field.props?.options && Array.isArray(field.props.options)) {
      duplicatedField.props!.options = [...field.props.options];
    }

    this.$fields.update((fields) => [...fields, duplicatedField]);
    this.$selectedField.set(duplicatedField);
  }
}
