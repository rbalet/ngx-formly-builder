import { Component, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

interface FieldType {
  type: string;
  label: string;
  icon: string;
}

interface FieldGroup {
  category: string;
  fields: FieldType[];
}

@Component({
  selector: 'app-field-palette',
  imports: [MatListModule, MatIconModule],
  template: `
    <div class="field-palette">
      <h5 class="mb-3">Field Types</h5>
      @for (group of fieldGroups; track group.category) {
        <div class="field-group">
          <div class="group-header">{{ group.category }}</div>
          <mat-action-list>
            @for (field of group.fields; track field.type) {
              <button mat-list-item (click)="onFieldSelect(field.type)">
                <mat-icon matListItemIcon>{{ field.icon }}</mat-icon>
                <span matListItemTitle>
                  {{ field.label }}
                </span>
              </button>
            }
          </mat-action-list>
        </div>
      }
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

      .field-group {
        margin-bottom: 1.5rem;
      }

      .field-group:last-child {
        margin-bottom: 0;
      }

      .group-header {
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
        font-weight: 600;
        color: #666;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 0.5rem;
      }

      .me-2 {
        margin-right: 0.5rem;
      }
    `,
  ],
})
export class FieldPaletteComponent {
  fieldSelect = output<string>();

  fieldGroups: FieldGroup[] = [
    {
      category: 'Input Fields',
      fields: [
        { type: 'input', label: 'Text Input', icon: 'input' },
        { type: 'textarea', label: 'Textarea', icon: 'description' },
        { type: 'number', label: 'Number', icon: 'numbers' },
        { type: 'email', label: 'Email', icon: 'email' },
        { type: 'password', label: 'Password', icon: 'lock' },
        { type: 'telephone', label: 'Telephone', icon: 'phone' },
        { type: 'url', label: 'URL', icon: 'link' },
      ],
    },
    {
      category: 'Selection Fields',
      fields: [
        { type: 'select', label: 'Select', icon: 'list' },
        { type: 'checkbox', label: 'Checkbox', icon: 'check_box' },
        { type: 'multicheckbox', label: 'Checkbox Group', icon: 'checklist' },
        { type: 'radio', label: 'Radio Group', icon: 'radio_button_checked' },
        { type: 'toggle', label: 'Toggle', icon: 'toggle_on' },
      ],
    },
    {
      category: 'Date & Time',
      fields: [
        { type: 'datepicker', label: 'Date Picker', icon: 'calendar_today' },
      ],
    },
  ];

  onFieldSelect(type: string) {
    this.fieldSelect.emit(type);
  }
}
