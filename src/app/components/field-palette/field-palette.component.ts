import { Component, output } from '@angular/core';

interface FieldType {
  type: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-field-palette',
  standalone: true,
  imports: [],
  template: `
    <div class="field-palette">
      <h5 class="mb-3 text-base font-semibold">Field Types</h5>
      <div class="space-y-1">
        @for (field of fieldTypes; track field.type) {
          <button
            type="button"
            class="w-full text-left px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50 active:bg-gray-100 rounded transition-colors"
            (click)="onFieldSelect(field.type)"
          >
            <span class="mr-2">{{ field.icon }}</span>
            {{ field.label }}
          </button>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .field-palette {
        padding: 1rem;
        height: 100%;
        background-color: #f9fafb;
        border-right: 1px solid #e5e7eb;
      }
    `,
  ],
})
export class FieldPaletteComponent {
  fieldSelect = output<string>();

  fieldTypes: FieldType[] = [
    { type: 'input', label: 'Text Input', icon: '📝' },
    { type: 'textarea', label: 'Textarea', icon: '📄' },
    { type: 'number', label: 'Number', icon: '🔢' },
    { type: 'email', label: 'Email', icon: '✉️' },
    { type: 'password', label: 'Password', icon: '🔐' },
    { type: 'telephone', label: 'Telephone', icon: '☎️' },
    { type: 'url', label: 'URL', icon: '🔗' },
    { type: 'select', label: 'Select', icon: '📋' },
  ];

  onFieldSelect(type: string) {
    this.fieldSelect.emit(type);
  }
}
