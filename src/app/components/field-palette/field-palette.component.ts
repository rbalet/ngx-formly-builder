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
      <h5 class="mb-3">Field Types</h5>
      <div class="list-group">
        @for (field of fieldTypes; track field.type) {
          <button
            type="button"
            class="list-group-item list-group-item-action"
            (click)="onFieldSelect(field.type)"
          >
            <span class="me-2">{{ field.icon }}</span>
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
        background-color: #f8f9fa;
        border-right: 1px solid #dee2e6;
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
