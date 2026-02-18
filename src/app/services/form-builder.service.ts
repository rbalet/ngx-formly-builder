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
    // Validate that field has a key
    if (!field.key) {
      console.error('Cannot duplicate field without a key');
      return;
    }

    // Deep copy the field to avoid shared references
    const duplicatedField: FormlyFieldConfig = structuredClone(field);
    // Use crypto.randomUUID() for robust unique key generation
    const uniqueId = crypto.randomUUID().slice(0, 8);
    duplicatedField.key = `${field.key}_copy_${uniqueId}`;

    this.$fields.update((fields) => [...fields, duplicatedField]);
    this.$selectedField.set(duplicatedField);
  }
}
