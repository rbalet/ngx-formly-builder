import { Component, output } from '@angular/core';
import { MatListModule } from '@angular/material/list';

interface FieldType {
  type: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-field-palette',
  standalone: true,
  imports: [MatListModule],
  template: `
    <div class="field-palette">
      <h5 class="mb-3">Field Types</h5>
      <mat-action-list>
        @for (field of fieldTypes; track field.type) {
          <button mat-list-item (click)="onFieldSelect(field.type)">
            <span matListItemTitle>
              <span class="me-2">{{ field.icon }}</span>
              {{ field.label }}
            </span>
          </button>
        }
      </mat-action-list>
    </div>
  `,
  styles: [
    `
      .field-palette {
        padding: 1rem;
        height: 100%;
        background-color: #fafafa;
        border-right: 1px solid #e0e0e0;
      }

      .me-2 {
        margin-right: 0.5rem;
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
