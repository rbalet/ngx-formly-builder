import { Component, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

interface FieldType {
  type: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-field-palette',
  imports: [MatListModule, MatIconModule],
  template: `
    <div class="field-palette">
      <h5 class="mb-3">Field Types</h5>
      <mat-action-list>
        @for (field of fieldTypes; track field.type) {
          <button mat-list-item (click)="onFieldSelect(field.type)">
            <mat-icon matListItemIcon>{{ field.icon }}</mat-icon>
            <span matListItemTitle>
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
    { type: 'input', label: 'Text Input', icon: 'input' },
    { type: 'textarea', label: 'Textarea', icon: 'description' },
    { type: 'number', label: 'Number', icon: 'numbers' },
    { type: 'email', label: 'Email', icon: 'email' },
    { type: 'password', label: 'Password', icon: 'lock' },
    { type: 'telephone', label: 'Telephone', icon: 'phone' },
    { type: 'url', label: 'URL', icon: 'link' },
    { type: 'select', label: 'Select', icon: 'list' },
    { type: 'checkbox', label: 'Checkbox', icon: 'check_box' },
    { type: 'multicheckbox', label: 'Checkbox Group', icon: 'checklist' },
    { type: 'radio', label: 'Radio Group', icon: 'radio_button_checked' },
    { type: 'toggle', label: 'Toggle', icon: 'toggle_on' },
    { type: 'datepicker', label: 'Date Picker', icon: 'calendar_today' },
  ];

  onFieldSelect(type: string) {
    this.fieldSelect.emit(type);
  }
}
