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
    // Deep copy the field to avoid shared references
    const duplicatedField: FormlyFieldConfig = structuredClone(field);
    duplicatedField.key = `${field.key}_copy_${Date.now()}`;

    this.$fields.update((fields) => [...fields, duplicatedField]);
    this.$selectedField.set(duplicatedField);
  }
}
